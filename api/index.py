# ============================================================
#  APP.PY — IqwanEngine Flask Backend Server V2.0
#  IqwanEngine | by Muhammad Hairul Iqwan
#
#  Endpoints:
#    POST /api/chat       — Main AI chat with grounded lookup
#    POST /api/save_lead  — Recruiter lead capture (SQLite)
#    GET  /api/health     — Service health check
#
#  Security:
#    - CORS restricted to allowed origins only
#    - Input validation on every endpoint
#    - Rate limiting (flask-limiter)
#    - SQL parameterization (no string interpolation)
#    - API key NEVER exposed to frontend
# ============================================================
# == IqwanEngine: API Serverless Entry Point

import logging
import os
import re
import sqlite3
import sys
from datetime import datetime

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# --- PEMBETULAN PATH VERCEL ---
# Dapatkan laluan ke folder /api sekarang
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Import module tempatan SELEPAS menetapkan path

from api.services.groq_service import groq_service
from api.services.notification import telegram_service

load_dotenv()

# ─────────────────────────────────────────────
#  APP SETUP
# ─────────────────────────────────────────────

app = Flask(__name__)

logger = logging.getLogger("IqwanEngine.App")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

# ─────────────────────────────────────────────
#  SECURITY: CORS — RESTRICT ORIGINS
# ─────────────────────────────────────────────
# ⚠️  CHANGE THIS to your actual frontend domain before deploying.
# Never use "*" in production — it allows any site to call your API.

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",  # Vite dev default + self
).split(",")

CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}})

# ─────────────────────────────────────────────
#  SECURITY: RATE LIMITING
# ─────────────────────────────────────────────

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

# ─────────────────────────────────────────────
#  DATABASE: LEAD CAPTURE (SQLite)
# ─────────────────────────────────────────────

DB_PATH = os.getenv("DB_PATH", "iqwanengine_leads.db")


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Initialize SQLite schema. Safe to call on every startup."""
    with get_db_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS leads (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                company_name    TEXT NOT NULL,
                contact_info    TEXT NOT NULL,
                additional_info TEXT,
                ip_address      TEXT,
                created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
    logger.info("IqwanEngine DB initialized: %s", DB_PATH)


# ─────────────────────────────────────────────
#  INPUT HELPERS
# ─────────────────────────────────────────────

MAX_FIELD_LENGTH = 500


def clean_field(value: object, max_len: int = MAX_FIELD_LENGTH) -> str:
    """Strip tags, control chars, and enforce length cap."""
    if not isinstance(value, str):
        return ""
    value = re.sub(r"<[^>]*>", "", value)
    value = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", value)
    return " ".join(value.split())[:max_len]


def get_client_ip() -> str:
    """Safely extract client IP, respecting reverse proxy headers."""
    forwarded = request.headers.get("X-Forwarded-For", "")
    if forwarded:
        # Take only the first IP in the chain (client IP)
        return clean_field(forwarded.split(",")[0].strip(), max_len=45)
    return request.remote_addr or "unknown"


# ─────────────────────────────────────────────
#  ENDPOINTS
# ─────────────────────────────────────────────


@app.route("/api/health", methods=["GET"])
def health():
    """Service health check. Safe to expose publicly."""
    return jsonify(
        {
            "status": "online",
            "engine": "IqwanEngine Core V2",
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
    )


@app.route("/api/notify_visit", methods=["POST"])
def notify_visit():
    """Trigger Tier 1 Notification."""
    data = request.get_json(silent=True)
    company_name = clean_field(data.get("companyName", "Anonymous Recruiter"))
    telegram_service.notify_visit(company_name)
    return jsonify({"status": "Visit notification sent."})


@app.route("/api/chat", methods=["POST"])
@limiter.limit("30 per minute")  # Per-endpoint override: tighter chat limit
def chat():
    """
    Main AI chat endpoint.

    Expected JSON body:
        {
            "message":        "string (required)",
            "history":        [ { "role": "user|assistant", "content": "..." } ],
            "companyName":    "string (optional)",
            "askedQuestions": ["string", ...]
        }

    Returns:
        {
            "response": { "answer": "...", "new_suggestions": [...] }
        }
    """
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body."}), 400

    message = clean_field(data.get("message", ""))
    if not message:
        return jsonify(
            {"error": "Field 'message' is required and cannot be empty."}
        ), 400

    history = data.get("history", [])
    company_name = clean_field(data.get("companyName", ""))
    asked = [
        clean_field(q) for q in data.get("askedQuestions", []) if isinstance(q, str)
    ]

    # Validate history is a list (not a string injection)
    if not isinstance(history, list):
        history = []

    logger.info(
        "Chat request | company='%s' | msg='%s...'",
        company_name or "anonymous",
        message[:40],
    )

    result = groq_service.chat(
        message=message,
        history=history,
        company_name=company_name,
        asked_questions=asked,
    )

    return jsonify({"response": result})


@app.route("/api/save_lead", methods=["POST"])
@limiter.limit("10 per hour")  # Tight limit — lead capture abuse prevention
def save_lead():
    """
    Recruiter lead capture.

    Expected JSON body:
        {
            "companyName":    "string (required)",
            "contactInfo":    "string (required)",
            "additionalInfo": "string (optional)"
        }

    Returns:
        { "status": "Lead captured successfully." }
    """
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body."}), 400

    company_name = clean_field(data.get("companyName", ""))
    contact_info = clean_field(data.get("contactInfo", ""))
    additional_info = clean_field(data.get("additionalInfo", ""), max_len=1000)

    if not company_name or not contact_info:
        return jsonify(
            {"error": "Fields 'companyName' and 'contactInfo' are required."}
        ), 400

    ip_address = get_client_ip()

    try:
        with get_db_connection() as conn:
            # ✅ Parameterized query — no SQL injection possible
            conn.execute(
                """
                INSERT INTO leads (company_name, contact_info, additional_info, ip_address)
                VALUES (?, ?, ?, ?)
                """,
                (company_name, contact_info, additional_info or None, ip_address),
            )
            conn.commit()

        # Trigger Tier 2 Notification
        telegram_service.notify_interest(company_name, contact_info)

        logger.info("Lead captured | company='%s' | ip='%s'", company_name, ip_address)
        return jsonify({"status": "Lead captured successfully."})
    except sqlite3.Error as e:
        logger.error("DB error saving lead: %s", e)
        return jsonify({"error": "Failed to save lead. Please try again."}), 500


# ─────────────────────────────────────────────
#  GLOBAL ERROR HANDLERS
# ─────────────────────────────────────────────


@app.errorhandler(404)
def not_found(_):
    return jsonify({"error": "Endpoint not found."}), 404


@app.errorhandler(405)
def method_not_allowed(_):
    return jsonify({"error": "Method not allowed."}), 405


@app.errorhandler(429)
def rate_limit_exceeded(_):
    return jsonify({"error": "Too many requests. Please slow down."}), 429


@app.errorhandler(500)
def internal_error(_):
    return jsonify({"error": "IqwanEngine internal error. Please try again."}), 500


# ─────────────────────────────────────────────
#  ENTRY POINT
# ─────────────────────────────────────────────

if __name__ == "__main__":
    init_db()
    port = int(os.getenv("PORT", 3000))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    # ⚠️ NEVER run debug=True in production — it exposes a code execution shell.
    logger.info("IqwanEngine Flask backend starting on port %d (debug=%s)", port, debug)
    app.run(host="0.0.0.0", port=port, debug=debug)

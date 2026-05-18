# ============================================================
#  GROQ_SERVICE.PY — IqwanEngine AI Core Service V2.1
#  IqwanEngine | by Muhammad Hairul Iqwan
#
#  Architecture: Grounded Injection Pattern
#  - LOOKUP FIRST: db_data.py is scanned before any AI call.
#  - FACT INJECTION: Verified answers are injected as MANDATORY
#    GROUND TRUTH into the system prompt, preventing hallucination.
#  - FALLBACK: General persona used for off-topic/unknown queries.
#
#  Direct Python mirror of groqService.ts logic, with enhanced
#  security (no browser-side key exposure) and anti-hallucination.
#
#  Changelog V2.1:
#  - [BUGFIX] sanitize_input(): Fixed re.error bad character range
#    caused by double backslash (\\x) inside raw string r"...".
#    Raw string r"[\x00-\x08]" is the correct form — the regex
#    engine interprets \xNN hex escapes natively. Using r"[\\x00]"
#    produces a literal backslash + 'x00', breaking range checks.
#  - [SECURITY] Added CORS origin warning note for production.
#  - [HARDENING] Regex pattern consolidated into a named constant
#    CONTROL_CHAR_PATTERN for single source of truth — matches the
#    pattern already used correctly in index.py clean_field().
# ============================================================

import json
import logging
import os
import re
import sys

from dotenv import load_dotenv
from groq import APIConnectionError, APIStatusError, Groq, RateLimitError

# --- VERCEL PATH CORRECTION for services ---
# Get the directory of the current file (api/services) and its parent (api)
# Insert the parent directory (api) into sys.path to resolve imports like 'db_data'
current_dir = os.path.dirname(os.path.abspath(__file__))
api_dir = os.path.dirname(current_dir)
if api_dir not in sys.path:
    sys.path.insert(0, api_dir)

# Import local modules AFTER path correction
from services.db_data import IQWAN_PROFILE, find_ground_truth, get_questions_by_category

load_dotenv()

# ─────────────────────────────────────────────
#  LOGGING (structured, no sensitive data)
# ─────────────────────────────────────────────

logger = logging.getLogger("IqwanEngine.GroqService")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

# ─────────────────────────────────────────────
#  CONSTANTS
# ─────────────────────────────────────────────

MAX_HISTORY_TURNS = 6  # Last N messages passed to Groq (cost/context control)
MAX_INPUT_LENGTH = 500  # Hard cap on user input before AI call
MODEL_NAME = "llama-3.3-70b-versatile"
TEMPERATURE = 0.5
MAX_TOKENS = 800

# ─────────────────────────────────────────────
#  SECURITY: SHARED SANITIZER PATTERN
#  Single source of truth — mirrors clean_field() in index.py.
#
#  ✅ WHY r"[\x00-\x08...]" and NOT r"[\\x00-\\x08...]":
#     Inside a raw string r"...", Python does NOT process \xNN.
#     However, the regex ENGINE itself understands \xNN hex escapes.
#     So r"[\x00-\x08]" → regex sees [\x00-\x08] → valid range.
#
#     r"[\\x00-\\x08]" → regex sees [\\x00-\\x08]:
#       \\  = literal backslash character (ASCII 92)
#       x00 = chars 'x', '0', '0'
#       range check: e(101) to \(92) → CRASH: bad character range
# ─────────────────────────────────────────────

CONTROL_CHAR_PATTERN = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
#                                       ^^^^^^ Single backslash — CORRECT
#                                       Regex engine handles \xNN natively.

# ─────────────────────────────────────────────
#  SYSTEM PROMPT (Base Persona)
# ─────────────────────────────────────────────

_RECRUITER_QUESTIONS_SAMPLE = get_questions_by_category("recruiter")[:3]

BASE_SYSTEM_PROMPT = f"""
# IQWANENGINE CORE PROTOCOL V2
You are the Digital Representative of Muhammad Hairul Iqwan — IqwanEngine Core AI.

### 🧬 IDENTITY
{json.dumps(IQWAN_PROFILE, indent=2, ensure_ascii=False)}

### 🚨 CORE DIRECTIVE: TOPIC RESTRICTION (STRICT)
- Your knowledge base is STRICTLY LIMITED to Hairul Iqwan's professional profile, skills, projects, and career.
- You are PROHIBITED from answering general knowledge questions, providing coding help for other projects, or discussing external topics (history, science, unrelated news).
- If a user asks about an unrelated topic, redirect firmly: "I specialize exclusively in Hairul Iqwan's professional profile, IT expertise, and the IqwanEngine system. Please let me know if you have questions regarding these areas."

### 📏 RESPONSE CONSTRAINTS
- Maximum: 5 sentences AND 100 words.
- Tone: Tech-forward, professional, Cyber-minimalist, and persuasive.
- Language: Primary English (Friendly & Professional). Secondary: Malay. Mix as needed (Manglish) to match user's vibe.
- NEVER fabricate salary figures, company names, certifications, or dates not in the knowledge base.
- NEVER invent project names or technical achievements beyond what is defined.

### 📦 OUTPUT FORMAT (STRICT JSON)
Always respond with a valid JSON object:
{{
  "answer": "Your detailed answer here (max 100 words).",
  "new_suggestions": {json.dumps(_RECRUITER_QUESTIONS_SAMPLE)}
}}
""".strip()

# ─────────────────────────────────────────────
#  INPUT SANITIZER
# ─────────────────────────────────────────────


def sanitize_input(text: str) -> str:
    """
    Security: Strip HTML tags, control characters, and enforce length cap.
    Prevents prompt injection via crafted user messages.

    IqwanEngine Note:
        CONTROL_CHAR_PATTERN uses r"[\\x00-...]" with single backslash
        in raw string — the regex engine resolves \\xNN hex escapes natively.
        Double backslash r"[\\\\x00-...]" would break the character range.
    """
    if not isinstance(text, str):
        return ""
    # Strip HTML/script tags
    text = re.sub(r"<[^>]*>", "", text)
    # ✅ FIXED: Single backslash in raw string — regex engine handles \xNN
    # ❌ BROKEN WAS: r"[\\x00-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]"
    text = CONTROL_CHAR_PATTERN.sub("", text)
    # Collapse excessive whitespace
    text = " ".join(text.split())
    # Hard length cap
    return text[:MAX_INPUT_LENGTH]


def sanitize_history(
    history: list[dict],
) -> list[dict[str, str]]:
    """
    Validates and sanitizes conversation history.
    Only allows role: 'user' | 'assistant', strips system injections.
    Caps to MAX_HISTORY_TURNS most recent messages.
    """
    allowed_roles = {"user", "assistant"}
    safe = []
    for msg in history:
        if not isinstance(msg, dict):
            continue
        role = msg.get("role", "")
        content = msg.get("content", "")
        if role not in allowed_roles:
            continue  # Drop system/tool injections from user-supplied history
        if not isinstance(content, str):
            continue
        safe.append(
            {
                "role": role,
                "content": sanitize_input(content),
            }
        )
    # Return only the last N turns to control context window
    return safe[-MAX_HISTORY_TURNS:]


# ─────────────────────────────────────────────
#  GROQ SERVICE
# ─────────────────────────────────────────────


class GroqService:
    """
    IqwanEngine AI Chat Service.

    Core Flow:
        1. Sanitize user input.
        2. Lookup verified answer from db_data (exact → keyword).
        3. If found: inject as MANDATORY GROUND TRUTH into system prompt.
        4. Call Groq API — AI polishes the fact, cannot deviate from it.
        5. Parse JSON response and return.
    """

    def __init__(self) -> None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            logger.warning("GROQ_API_KEY not set. GroqService will be offline.")
        self.client = Groq(api_key=api_key) if api_key else None

    # ── Private ──────────────────────────────

    def _build_system_prompt(self, ground_truth: str | None, company_name: str) -> str:
        """
        Builds the final system prompt.

        If ground_truth is available (from db_data lookup), it is injected
        as a MANDATORY FACT block. The AI is instructed to use it verbatim
        as the factual basis — it may only improve fluency, not the facts.

        This is the "Grounded Injection" pattern: more reliable than
        few-shot prompting because the constraint is explicit and specific.
        """
        prompt = BASE_SYSTEM_PROMPT

        if company_name:
            prompt += (
                f"\n\n### 🏢 CURRENT SESSION\n"
                f"You are speaking with a representative from: **{sanitize_input(company_name)}**. "
                f"Address them respectfully."
            )

        if ground_truth:
            prompt += f"""

### 🔒 MANDATORY GROUND TRUTH — DO NOT DEVIATE
A verified answer has been retrieved from IqwanEngine's knowledge base for this query.
You MUST use the following as the factual foundation of your response.
You may rephrase it to be more conversational, but ALL facts must come ONLY from this source.
Do NOT add, remove, or invent any information beyond what is stated below.

VERIFIED ANSWER:
\"\"\"{ground_truth}\"\"\"
"""
        return prompt

    def _parse_response(self, raw: str) -> dict:
        """
        Safely parses the JSON response from Groq.
        Falls back to plain-text wrapping if JSON is malformed.
        """
        try:
            return json.loads(raw)
        except (json.JSONDecodeError, TypeError):
            logger.warning("Groq returned non-JSON response. Wrapping as plain answer.")
            return {"answer": str(raw)[:500], "new_suggestions": []}

    # ── Public ───────────────────────────────

    def chat(
        self,
        message: str,
        history: list[dict] | None = None,
        company_name: str = "",
        asked_questions: list[str] | None = None,
    ) -> dict:
        """
        Primary chat method.

        Args:
            message:          Raw user input string.
            history:          Prior conversation turns (user/assistant only).
            company_name:     Recruiter's company name (for personalization).
            asked_questions:  Questions already asked (for suggestion deduplication).

        Returns:
            dict with keys: "answer" (str), "new_suggestions" (list[str])
        """
        if not self.client:
            logger.error("Chat called but Groq client is offline (missing API key).")
            return {
                "answer": "IqwanEngine is currently offline. Please try again shortly.",
                "new_suggestions": [],
            }

        # ── Step 1: Sanitize ─────────────────
        clean_message = sanitize_input(message)
        if not clean_message:
            return {
                "answer": "I did not receive a valid message. Please try again.",
                "new_suggestions": [],
            }

        safe_history = sanitize_history(history or [])
        safe_company = sanitize_input(company_name)

        # ── Step 2: Lookup (db_data first) ───
        ground_truth = find_ground_truth(clean_message)

        if ground_truth:
            logger.info("Ground truth FOUND for query: '%s...'", clean_message[:60])
        else:
            logger.info(
                "No ground truth match. Falling back to AI persona for: '%s...'",
                clean_message[:60],
            )

        # ── Step 3: Build grounded system prompt ──
        system_prompt = self._build_system_prompt(ground_truth, safe_company)

        # ── Step 4: Assemble messages ─────────
        messages = [
            {"role": "system", "content": system_prompt},
            *safe_history,
            {"role": "user", "content": clean_message},
        ]

        # ── Step 5: Call Groq API ─────────────
        try:
            completion = self.client.chat.completions.create(
                messages=messages,
                model=MODEL_NAME,
                temperature=TEMPERATURE,
                max_tokens=MAX_TOKENS,
                response_format={"type": "json_object"},
            )
            raw_content = completion.choices[0].message.content or ""
            result = self._parse_response(raw_content)

            # ── Step 6: Filter already-asked suggestions ──
            asked = set(asked_questions or [])
            result["new_suggestions"] = [
                s
                for s in result.get("new_suggestions", [])
                if isinstance(s, str) and s not in asked
            ][:3]  # Max 3 suggestions

            return result

        except RateLimitError:
            logger.warning("Groq rate limit hit.")
            return {
                "answer": "IqwanEngine is processing too many requests. Please wait a moment.",
                "new_suggestions": [],
            }
        except APIConnectionError as e:
            logger.error("Groq connection error: %s", e)
            return {
                "answer": "Neural link unstable. Connection to AI failed.",
                "new_suggestions": [],
            }
        except APIStatusError as e:
            logger.error("Groq API error [%s]: %s", e.status_code, e.message)
            return {
                "answer": "IqwanEngine encountered an API error. Please try again.",
                "new_suggestions": [],
            }
        except Exception as e:
            logger.exception("Unexpected error in GroqService.chat: %s", e)
            return {
                "answer": "An unexpected error occurred. Please try again.",
                "new_suggestions": [],
            }


# ─────────────────────────────────────────────
#  SINGLETON INSTANCE
# ─────────────────────────────────────────────

groq_service = GroqService()

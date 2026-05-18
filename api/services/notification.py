import logging
import os

import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("IqwanEngine.TelegramService")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


class TelegramService:
    def __init__(self):
        # Mandatory Security: Load credentials from environment
        self.token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.admin_id = os.getenv("ADMIN_ID")
        self.base_url = (
            f"https://api.telegram.org/bot{self.token}/sendMessage"
            if self.token
            else None
        )

    def send_notification(self, message, buttons=None):
        """Helper to send telegram messages with optional buttons."""
        if not self.token or not self.admin_id:
            logger.warning("IqwanEngine: Skipping Telegram - Credentials missing.")
            return False

        if not self.base_url:
            logger.error("IqwanEngine: Telegram base URL not configured.")
            return False

        payload = {"chat_id": self.admin_id, "text": message, "parse_mode": "HTML"}

        if buttons:
            payload["reply_markup"] = {"inline_keyboard": [buttons]}

        try:
            response = requests.post(self.base_url, json=payload)
            response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
            return response.ok
        except requests.exceptions.RequestException as e:
            logger.error("IqwanEngine: Telegram Webhook Error: %s", e)
            return False
        except Exception as e:
            logger.error("IqwanEngine: Unexpected error in TelegramService: %s", e)
            return False

    def notify_visit(self, company_name):
        """Tier 1 Notification: Visitor Alert"""
        message = (
            f"✨ <b>[ IQWANENGINE : VISIT ALERT ]</b> ✨\n"
            f"━━━━━━━━━━━━━━━━━━━━━\n\n"
            f"🏢 <b>Company:</b>\n"
            f"┗ <code>{company_name}</code>\n\n"
            f"━━━━━━━━━━━━━━━━━━━━━\n"
            f"👀 <i>Iqwan, someone just visited your Recruiter AI. Go check it out!</i> 🚀"
        )
        buttons = [
            {
                "text": "🔍 Search Company Info",
                "url": f"https://www.google.com/search?q={company_name}",
            }
        ]
        return self.send_notification(message, buttons)

    def notify_interest(self, company_name, details):
        """Tier 2 Notification: High-Value Lead Alert"""
        message = (
            f"🔥 <b>[ IQWANENGINE : HOT INTEREST ]</b> 🔥\n"
            f"━━━━━━━━━━━━━━━━━━━━━\n\n"
            f"🏢 <b>Company:</b>\n"
            f"┗ <code>{company_name}</code>\n\n"
            f"📋 <b>Additional Details:</b>\n"
            f"┗ <code>{details}</code>\n\n"
            f"━━━━━━━━━━━━━━━━━━━━━\n"
            f"🎯 <i>Iqwan, a prospect is interested in you! Great opportunity to pitch them.</i> ⚡"
        )
        buttons = [
            {
                "text": "📄 Send Resume",
                "url": "https://your-admin-dashboard.com",
            },
            {
                "text": "🔍 Search Company Info",
                "url": f"https://www.google.com/search?q={company_name}",
            },
        ]
        return self.send_notification(message, buttons)


telegram_service = TelegramService()

# ==IqwanEngine: Telegram Notification Service
import os

import requests
from dotenv import load_dotenv

load_dotenv()


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
            print("#==IqwanEngine: Skipping Telegram - Credentials missing.")
            return False

        payload = {"chat_id": self.admin_id, "text": message, "parse_mode": "HTML"}

        if buttons:
            payload["reply_markup"] = {"inline_keyboard": [buttons]}

        try:
            response = requests.post(self.base_url, json=payload)
            return response.ok
        except Exception as e:
            print(f"#==IqwanEngine: Telegram Webhook Error: {e}")
            return False

    def notify_visit(self, company_name):
        """Tier 1 Notification: Visitor Alert"""
        message = (
            f"🚀 <b>IQWANENGINE: VISIT</b>\n"
            f"━━━━━━━━━━━━━━━━━━━━\n"
            f"🏢 <b>Syarikat:</b> {company_name}\n"
            f"<i>Iqwan, ada orang melawat Recruiter AI anda.</i>"
        )
        buttons = [
            {
                "text": "🔍 Lihat Info Syarikat",
                "url": f"https://www.google.com/search?q={company_name}",
            }
        ]
        return self.send_notification(message, buttons)

    def notify_interest(self, company_name, details):
        """Tier 2 Notification: High-Value Lead Alert"""
        message = (
            f"🔥 <b>IQWANENGINE: INTEREST</b>\n"
            f"━━━━━━━━━━━━━━━━━━━━\n"
            f"🏢 <b>Syarikat:</b> {company_name}\n"
            f"<i>Iqwan, ada orang berminat dengan anda, mungkin boleh tackle dia.</i>"
        )
        buttons = [
            {
                "text": "📱 Details Recruiter",
                "url": "https://your-admin-dashboard.com",
            },  # Replace with actual link if needed
            {
                "text": "🔍 Lihat Info Syarikat",
                "url": f"https://www.google.com/search?q={company_name}",
            },
        ]
        return self.send_notification(message, buttons)


telegram_service = TelegramService()

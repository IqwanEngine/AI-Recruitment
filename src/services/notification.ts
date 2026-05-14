//#==IqwanEngine: Telegram Notification Service
import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;

/**
 * Sends a Telegram notification to the admin.
 * @param message The text to send
 * @param buttons Optional inline keyboard buttons
 */
export async function sendTelegramNotification(message: string, buttons: any[] = []) {
  if (!BOT_TOKEN || !ADMIN_ID) {
    console.warn("//#==IqwanEngine: Telegram credentials missing. Skipping notification.");
    return;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const payload: any = {
    chat_id: ADMIN_ID,
    text: message,
    parse_mode: 'HTML',
  };

  if (buttons.length > 0) {
    payload.reply_markup = {
      inline_keyboard: [buttons]
    };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("//#==IqwanEngine: Telegram API Error:", errorText);
    }
  } catch (error) {
    console.error("//#==IqwanEngine: Failed to send Telegram notification:", error);
  }
}

/**
 * Tier 1: Visitor Alert
 */
export async function notifyVisit(companyName: string) {
  const message = `<b>IqwanEngine Notification</b>\n\nIqwan, ada orang melawat Recruiter AI anda dari <b>${companyName}</b>.`;
  const buttons = [
    { text: "🔍 Lihat Info Syarikat", url: `https://www.google.com/search?q=${encodeURIComponent(companyName)}` }
  ];
  return sendTelegramNotification(message, buttons);
}

/**
 * Tier 2: Interest Alert
 */
export async function notifyInterest(companyName: string, details: string) {
  const message = `<b>🚨 HIGH-VALUE ALERT</b>\n\nIqwan, ada orang berminat dengan anda, mungkin boleh tackle dia.\n\n<b>Company:</b> ${companyName}\n<b>Details:</b> ${details}`;
  const buttons = [
    { text: "📱 Details Recruiter", callback_data: "view_details" }, // Note: handling callbacks requires a separate listener
    { text: "🔍 Lihat Info Syarikat", url: `https://www.google.com/search?q=${encodeURIComponent(companyName)}` }
  ];
  return sendTelegramNotification(message, buttons);
}

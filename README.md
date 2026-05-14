# IqwanEngine Recruitment Portfolio - Backend

### 🚀 Architecture Overview
This is a robust, fail-safe backend designed for Hairul Iqwan's recruitment AI. It routes recruiter data through multiple channels while ensuring data integrity.

- **Primary DB**: SQLite (`database.db`) - Every lead is saved here first.
- **AI Hub**: Groq Cloud - Orchestrates LLM responses for the recruiter chat.
- **Alert System**: Telegram Webhooks - Provides instant mobile notifications to Iqwan.
- **Email Automation**: Google Apps Script (GAS) Webhook - Bridges leads to a centralized Google Sheet/Email.

---

### 📂 File Structure
```text
/
├── app.py                # Main Flask entry point & API orchestration
├── models/
│   └── schema.py         # SQLite database initialization & fail-safe logic
├── services/
│   ├── groq_service.py   # Groq AI implementation & JSON formatters
│   └── notification.py   # Telegram Tier 1 & Tier 2 notification logic
├── requirements.txt      # Python dependencies
└── .env.example          # Environment variables template
```

---

### 🛠️ Installation & Local Setup

1. **Clone & Navigate**:
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```

2. **Environment Setup**:
   - Copy `.env.example` to a new file named `.env`.
   - Fill in your `GROQ_API_KEY`, `TELEGRAM_BOT_TOKEN`, and `ADMIN_ID`.
   - *Crucial*: Ensure `.env` is listed in your `.gitignore` to prevent leaking API keys.

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Server**:
   ```bash
   python app.py
   ```

---

### 🔐 Security & Fail-Safe Protocol
1. **Data-First**: The `/api/save_lead` endpoint commits data to the local SQLite database **before** attempting any external network calls (Telegram or GAS).
2. **Credential Safety**: No API keys are hardcoded. The application strictly uses `python-dotenv` for configuration.
3. **Graceful Degradation**: If external services go down, the API returns a success message to the recruiter (as the data is saved in DB) while logging the webhook errors internally.

---

### 📦 Deployment to Production
When pushing to GitHub:
1. Double check that `database.db` and `.env` are NOT in your tracking list.
2. If deploying to Render or Heroku, add your environment variables to the platform's Dashboard settings.
3. Use `gunicorn app:app` as your start command for better performance.

#==IqwanEngine

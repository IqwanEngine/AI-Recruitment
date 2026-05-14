# ============================================================
#  DB_DATA.PY — Master Professional Profile Database V5.0
#  IqwanEngine | by Muhammad Hairul Iqwan
#  Python Mirror of db_data.ts (Source of Truth for Flask Backend)
# ============================================================
#
#  SECURITY NOTES (IqwanEngine Protocol):
#   - All user input MUST be sanitized before lookup (see groq_service.py).
#   - [RESUME_BTN] markers are stripped before AI processing.
#   - Placeholder {{keyword}} / {{name}} are NOT interpolated here;
#     they are resolved in the service layer using sanitized input only.
# ============================================================

import re
from dataclasses import dataclass
from typing import Literal

QACategory = Literal["recruiter", "hook", "personal", "fun"]


@dataclass(frozen=True)
class QAItem:
    question: str
    keywords: list[str]
    response: str
    category: QACategory


# ─────────────────────────────────────────────
#  PROFILE (Locked)
# ─────────────────────────────────────────────

IQWAN_PROFILE = {
    "name": "Muhammad Hairul Iqwan",
    "full_name": "Muhammad Hairul Iqwan Bin Mohd Yaziz",
    "preferred_name": "Hairul Iqwan",
    "specialty": "Workflow Automation Specialist & Python Developer",
    "location": "Banting, Selangor / Near Cyberjaya, Malaysia",
    "experience": "10+ years in customer operations & automation architecture",
    "philosophy": "Identify a bottleneck, and automate the solution.",
    "motto": "Build smart. Automate everything. Optimize continuously.",
    "availability": "Status: OPEN TO WORK. Protocol: Immediate Deployment.",
    "contact": {
        "email": "hairuliqwan352@gmail.com",
        "linkedin": "https://www.linkedin.com/in/iqwanengine-automation",
    },
    "family": {
        "wife": "EyllaDylla (Dilla)",
        "children": ["Aisy Adryan (Son)", "Raisya Ayleen (Daughter)"],
    },
    "iqwan_engine": {
        "system_name": "IqwanEngine FX V3",
        "market_focus": "XAUUSD (Gold)",
        "architecture": "AI-Integrated Algorithmic Trading System",
        "core_features": [
            "Real-time Sentiment Analysis",
            "Automated Risk Management",
            "Advanced Trend Detection Logic",
            "High-Precision Execution Protocol",
        ],
        "tech_stack": ["Python", "MT5 API", "Gemini AI", "Pandas", "NumPy"],
    },
    "core_values": {
        "integrity": "High focus on transparency and data honesty.",
        "growth_mindset": "Self-taught programmer. Constant self-driven learning.",
        "dedication": "High stamina for deep-focus sessions.",
        "problem_solving": "Proactive engineering approach.",
    },
    "community": "Founder of a 7,000+ member tech community.",
}


# ─────────────────────────────────────────────
#  QA DATABASE — All Sections
# ─────────────────────────────────────────────

QA_DATA: list[QAItem] = [
    # ══════════════════════════════
    #  SECTION 1 — RECRUITER
    # ══════════════════════════════
    QAItem(
        question="What is Iqwan's primary tech stack?",
        keywords=["tech stack", "languages", "programming", "tools", "core stack", "technical skills"],
        response=(
            "Driven by a love for continuous learning, Iqwan applies Python and React to create practical tools. "
            "He is also developing his skills in Workflow Automation and Google Apps Script, always looking for simple "
            "ways to help teams become more efficient. He is committed to giving his full effort to deliver the best "
            "results for your organization."
        ),
        category="recruiter",
    ),
    QAItem(
        question="How does Iqwan manage high-pressure environments?",
        keywords=["pressure", "stress", "difficult", "fast-paced", "handle stress", "manage pressure"],
        response=(
            "Working in Customer Operations taught him that things don't always go to plan. He handles pressure by "
            "staying calm and breaking down big problems into smaller, manageable steps. He believes that a steady "
            "head not only solves technical issues faster but also helps keep the team's morale up. He is ready to "
            "bring this resilient mindset to your team."
        ),
        category="recruiter",
    ),
    QAItem(
        question="Is Iqwan open to remote or hybrid roles?",
        keywords=["remote", "work from home", "wfh", "anywhere", "hybrid setup"],
        response=(
            "Yes, he is very comfortable with digital collaboration and remote setups. Currently based in Cyberjaya, "
            "he is happy to adapt to the team's preferred working style to ensure maximum output and clear communication."
        ),
        category="recruiter",
    ),
    QAItem(
        question="Is Iqwan willing to travel or relocate?",
        keywords=["travel", "relocate", "moving", "overseas", "relocation"],
        response=(
            "Iqwan is open to both domestic and international travel. He is also open to discussing relocation if it "
            "aligns with the needs and growth of the project. He is flexible and ready to commit wherever his skills "
            "are needed most."
        ),
        category="recruiter",
    ),
    QAItem(
        question="What is Iqwan's current availability to start?",
        keywords=["available", "start date", "availability", "notice", "join"],
        response=(
            "He is ready to contribute and can start as soon as needed. He values a smooth transition and is happy "
            "to discuss the best timeline for the team. He is prepared to give his 100% commitment from day one."
        ),
        category="recruiter",
    ),
    QAItem(
        question="What are Iqwan's salary expectations?",
        keywords=["salary", "expected", "pay", "compensation", "money"],
        response=(
            "Iqwan believes in a mutually beneficial arrangement where the offer reflects the value he brings to the "
            "team. While he looks for something aligned with market rates, he is more focused on the right fit and the "
            "impact he can make. He's always open to a transparent conversation about these details once there's a "
            "better understanding of the team's specific needs."
        ),
        category="recruiter",
    ),
    QAItem(
        question="What is Iqwan's professional background?",
        keywords=["experience", "years", "background", "history", "career", "concentrix"],
        response=(
            "With 10 years of experience, he bridges the gap between daily operations and technical automation. "
            "He doesn't just build tools for the sake of tech; he uses his background to ensure every script or "
            "system he develops solves a real human problem for his team. He is eager to bring this problem-solving "
            "experience to your project."
        ),
        category="recruiter",
    ),
    QAItem(
        question="Does he have experience with AI integration?",
        keywords=["ai", "llm", "gpt", "gemini", "artificial intelligence"],
        response=(
            "Yes, he's actually quite hands-on with it. He actively explores ways to integrate AI into daily "
            "workflows—not just for the sake of using new tech, but as a practical way to help the team make better "
            "decisions and save time. He is dedicated to mastering AI tools to keep your workflows modern and efficient."
        ),
        category="recruiter",
    ),
    QAItem(
        question="Can you tell me about the IqwanEngine project?",
        keywords=["iqwanengine", "trading", "algorithmic", "xauusd", "gold", "trading system"],
        response=(
            "IqwanEngine is his flagship project—a production-grade, AI-integrated algorithmic trading system "
            "specifically built for the XAUUSD (Gold) market. It uses Python, MT5 API, and Gemini AI. This system "
            "reflects his humble beginnings as a self-taught coder and his vision for high-level automated architecture."
        ),
        category="recruiter",
    ),
    QAItem(
        question="What is Iqwan's most impactful operational achievement?",
        keywords=["achievement", "impact", "reduce", "time", "efficiency", "success"],
        response=(
            "During his time as an Automation Specialist, he engineered a centralized Knowledge Base that reduced "
            "information retrieval time by 80%. He also built automated scripts that cut ticketing time significantly. "
            "He is humble about these results but remains hungry to achieve even greater efficiency for your team."
        ),
        category="recruiter",
    ),
    QAItem(
        question="Why should we hire you over other candidates?",
        keywords=["why hire you", "reason", "value", "hire him", "edge", "advantage"],
        response=(
            "Iqwan brings a rare combination: he understands both business operations and technical logic. With 10+ "
            "years handling real-world friction, he builds automations that solve actual problems. He is a dedicated "
            "learner who will always do his best to ensure your team stays ahead."
        ),
        category="recruiter",
    ),
    QAItem(
        question="What is your vision for the next 2 to 5 years?",
        keywords=["5 years", "2 years", "future", "vision", "career path", "long term"],
        response=(
            "Over the next few years, Iqwan aims to evolve into a Lead Automation Architect. He wants to spearhead "
            "enterprise-level AI integrations and build scalable, self-sustaining systems. He is a visionary who is "
            "ready to grow alongside your company and contribute to its long-term success."
        ),
        category="recruiter",
    ),
    QAItem(
        question="How does Iqwan approach team collaboration?",
        keywords=["team", "collab", "collaboration", "teamwork", "together", "leadership", "mentorship"],
        response=(
            "Iqwan believes that the best code is written together. He actively listens to his team's needs and "
            "enjoys mentoring peers in automation best practices. His priority is always fostering a supportive, "
            "transparent environment where everyone can thrive."
        ),
        category="recruiter",
    ),
    QAItem(
        question="What is Iqwan's core approach to problem-solving?",
        keywords=["problem-solving", "approach", "bottleneck", "solve", "solution", "troubleshoot"],
        response=(
            "He follows a proactive engineering mindset. Instead of applying temporary fixes to repetitive manual "
            "tasks, he digs deep to find the root cause (the bottleneck) and architects an automated system to "
            "eliminate it completely."
        ),
        category="recruiter",
    ),
    QAItem(
        question="How does Iqwan's trading background benefit a non-finance IT role?",
        keywords=["trading background", "finance", "non-finance", "transferable"],
        response=(
            "Trading requires extreme precision under pressure—the same skills that make him an exceptional "
            "automation engineer. The discipline of managing risk in Gold markets translates directly to writing "
            "fail-safe scripts and anticipating edge cases in production systems."
        ),
        category="recruiter",
    ),
    QAItem(
        question="What complex API challenges has he solved recently?",
        keywords=["api", "api challenges", "integration", "rest", "webhook"],
        response=(
            "He recently architected a multi-source data pipeline that synchronizes market sentiment feeds from "
            "multiple APIs with his IqwanEngine trading system, requiring real-time error handling and fallback "
            "protocols. Managing asynchronous data streams and rate-limiting is now second nature to him."
        ),
        category="recruiter",
    ),
    QAItem(
        question="Can he explain the UI/UX philosophy behind IqwanEngine?",
        keywords=["ui", "ux", "design", "interface", "user experience"],
        response=(
            "His UI/UX philosophy is 'Cyberpunk Minimalism'—every element must have a purpose. He designs for "
            "cognitive clarity: the user should never have to think about the interface, only the data. "
            "Dark mode, electric blue accents, and data-dense layouts are his signature aesthetic."
        ),
        category="recruiter",
    ),
    QAItem(
        question="How does he ensure code scalability in his automation scripts?",
        keywords=["scalability", "scale", "modular", "maintainable", "clean code"],
        response=(
            "He applies the Single Responsibility Principle religiously—every function does exactly one thing. "
            "He structures his Python projects as modular services with clear data contracts, making it trivial "
            "to swap or extend any component without breaking the whole system."
        ),
        category="recruiter",
    ),
    QAItem(
        question="What is his approach to learning a completely new tech stack?",
        keywords=["new tech", "learning new", "adaptability", "pick up", "learn fast"],
        response=(
            "He starts with a 'Hello World' project and immediately pushes it to a real use case. Theory is "
            "validated by doing. He dedicates focused 1-hour deep learning sessions nightly and leverages the "
            "builder community he founded to accelerate knowledge transfer."
        ),
        category="recruiter",
    ),
    QAItem(
        question="How does he balance technical execution with business operational needs?",
        keywords=["business", "operations", "stakeholder", "balance", "execution"],
        response=(
            "His 10 years in Customer Operations is the foundation. Before writing a single line of code, he maps "
            "the operational pain point and defines success in business terms—time saved, error rate reduced. "
            "Technical execution is always in service of a measurable business outcome."
        ),
        category="recruiter",
    ),

    # ══════════════════════════════
    #  SECTION 2 — HOOK
    # ══════════════════════════════
    QAItem(
        question="What makes Iqwan different from other devs?",
        keywords=["different", "unique", "edge", "why you"],
        response="Most devs code for the machine; Iqwan codes for the operation. His background in Customer Service means he understands the 'why' before he even touches the 'how'.",
        category="hook",
    ),
    QAItem(
        question="Can IqwanEngine really beat the market?",
        keywords=["beat the market", "profitable", "risk", "accuracy"],
        response="No system is perfect, but IqwanEngine is built on rigorous risk management. It's about consistency and removing human emotion from the equation.",
        category="hook",
    ),
    QAItem(
        question="Why focus on automation instead of full-stack?",
        keywords=["focus", "automation vs coding", "specialization"],
        response="Because automation is where the immediate ROI is for a company. He'd rather reclaim 100 hours for a team than just build another pretty landing page.",
        category="hook",
    ),
    QAItem(
        question="What is your 'Secret Sauce' in coding?",
        keywords=["secret", "method", "workflow"],
        response="Simplicity. If a script needs a 10-page manual to run, it's not a good script. His approach is 'Plug and Play'.",
        category="hook",
    ),
    QAItem(
        question="What's the biggest bug you've ever fixed?",
        keywords=["bug", "error", "debug", "mistake"],
        response="Once an automation loop almost wiped a database. It taught him the importance of 'Fail-Safe' protocols and rigorous testing.",
        category="hook",
    ),
    QAItem(
        question="How do you handle rapid tech changes?",
        keywords=["change", "learning", "updated", "trends"],
        response="He dedicates 1 hour every night to 'Deep Learning.' Whether it's a new Python library or a Gemini update, he stays curious.",
        category="hook",
    ),
    QAItem(
        question="What is your 'Automation Philosophy'?",
        keywords=["philosophy", "motto", "principle"],
        response="If you have to do it more than twice, automate it. Human creativity is too valuable to waste on repetitive clicking.",
        category="hook",
    ),
    QAItem(
        question="Is Python really the best for automation?",
        keywords=["why python", "javascript vs python"],
        response="For data-heavy and logic-complex tasks, Python is king. Its ecosystem is unmatched, especially with AI integration.",
        category="hook",
    ),
    QAItem(
        question="How do you measure project success?",
        keywords=["success", "metric", "kpi"],
        response="Success = Time Saved + Error Rate Reduction. If an automation doesn't hit those two, the job isn't finished.",
        category="hook",
    ),
    QAItem(
        question="Do you build custom AI models?",
        keywords=["custom ai", "training", "fine tuning"],
        response="He specializes in 'Instruction Engineering' and API orchestration. Fine-tuning models is great, but smart prompting often solves 90% of business needs faster.",
        category="hook",
    ),

    # ══════════════════════════════
    #  SECTION 3 — PERSONAL
    # ══════════════════════════════
    QAItem(
        question="What motivates you every morning?",
        keywords=["motivation", "drive", "family", "kids"],
        response="His family. Being a father to Aisy and Raisya makes him want to build a future where tech enables more time with loved ones.",
        category="personal",
    ),
    QAItem(
        question="How do you stay healthy with a tech lifestyle?",
        keywords=["health", "routine", "blood pressure", "supplements"],
        response="He is very disciplined with his health regimen. Managing high blood pressure taught him that a sharp mind needs a well-maintained body.",
        category="personal",
    ),
    QAItem(
        question="Why are you based in Cyberjaya?",
        keywords=["cyberjaya", "location", "tech hub"],
        response="It's the Silicon Valley of Malaysia. Being surrounded by tech energy and innovation keeps him in the right 'Deep Work' headspace.",
        category="personal",
    ),
    QAItem(
        question="Are you a self-taught developer?",
        keywords=["self taught", "degree", "education"],
        response="Yes. He believes a degree gets you the interview, but curiosity and projects like IqwanEngine get you the results. He is a student of the internet.",
        category="personal",
    ),
    QAItem(
        question="What do you do in your free time?",
        keywords=["hobby", "free time", "gaming"],
        response="He explores financial markets or refines UI aesthetics. Sometimes, a good road trip with the family is the best way to reboot the brain.",
        category="personal",
    ),
    QAItem(
        question="What's the meaning behind 'IqwanEngine'?",
        keywords=["engine", "meaning", "brand"],
        response="It represents a 'continuous motor' of growth. Not just a coder—the engine that drives a team forward.",
        category="personal",
    ),
    QAItem(
        question="What kind of father are you?",
        keywords=["father", "parenting", "family", "married"],
        response="The 'Educator' father. He wants Aisy and Raisya to see that with logic and hard work, they can build anything they can imagine.",
        category="personal",
    ),
    QAItem(
        question="Do you like Cyberpunk aesthetics?",
        keywords=["cyberpunk", "style", "design", "blue"],
        response="Absolutely. The 'Neon Blue' and 'Dark Mode' vibe represents the future—clean, high-tech, and efficient. Exactly like his code.",
        category="personal",
    ),
    QAItem(
        question="What is your dream role?",
        keywords=["dream job", "ambition"],
        response="To be a Lead Automation Architect in a company that isn't afraid to break traditional workflows to achieve 10x growth.",
        category="personal",
    ),
    QAItem(
        question="Who is your tech inspiration?",
        keywords=["hero", "inspiration", "mentor"],
        response="Anyone who can take a complex problem and explain it to a 5-year-old. That level of mastery is what he strives for.",
        category="personal",
    ),

    # ══════════════════════════════
    #  SECTION 4 — FUN
    # ══════════════════════════════
    QAItem(
        question="Coffee or Tea?",
        keywords=["coffee", "tea", "drink"],
        response="Coffee for coding, Tea for family time. IqwanEngine runs on pure logic and maybe a bit of caffeine!",
        category="fun",
    ),
    QAItem(
        question="Light Mode or Dark Mode?",
        keywords=["light mode", "dark mode", "theme"],
        response="Dark Mode. Always. We are building the future in the shadows of the terminal.",
        category="fun",
    ),
    QAItem(
        question="What's your favorite coding snack?",
        keywords=["snack", "food", "eat"],
        response="Anything that doesn't make the keyboard greasy! But usually, too focused on the work to even remember to eat.",
        category="fun",
    ),
    QAItem(
        question="If you were an AI, which one would you be?",
        keywords=["which ai", "robot"],
        response="A specialized Agent—quietly working in the background, making sure everything runs perfectly without being noticed.",
        category="fun",
    ),
    QAItem(
        question="What was your first computer?",
        keywords=["first pc", "old tech", "nostalgia"],
        response="A humble machine that crashed a lot. It taught the most important lesson in tech: Save your work often!",
        category="fun",
    ),
    QAItem(
        question="Can you explain Gold trading to a 5-year-old?",
        keywords=["explain like i'm 5", "eli5"],
        response="It's like playing a game of 'Guess the Price.' But instead of guessing, we use a super-smart robot (IqwanEngine) to help us win.",
        category="fun",
    ),
    QAItem(
        question="Vim or VS Code?",
        keywords=["vim", "vscode", "editor"],
        response="VS Code for the UI, but I respect the 'hardcore' Vim users. Currently loving the Zed Editor for its speed!",
        category="fun",
    ),
    QAItem(
        question="What's the most useless app you ever made?",
        keywords=["useless", "funny project"],
        response="A script that sent a notification saying 'You are still coding' every 5 minutes. Deleted it very quickly!",
        category="fun",
    ),
    QAItem(
        question="What happens if AI takes over the world?",
        keywords=["ai takeover", "future of ai"],
        response="Then hopefully the AI was programmed by someone who values 'Human-Centric' logic, just like Iqwan does.",
        category="fun",
    ),
    QAItem(
        question="Can you write code in your sleep?",
        keywords=["sleep", "dreaming code"],
        response="Sometimes waking up with the solution to a bug! The brain never really stops the process.",
        category="fun",
    ),
    QAItem(
        question="Tab or Space?",
        keywords=["tab", "space", "indentation"],
        response="Spaces. 4 of them. Let's not start a war! Logic and consistency are what matter.",
        category="fun",
    ),
    QAItem(
        question="What's your 'Power Song' while coding?",
        keywords=["music", "coding playlist", "song"],
        response="Anything Lo-Fi or Synthwave. It fits the Cyberpunk vibe of the terminal perfectly.",
        category="fun",
    ),
    QAItem(
        question="Window or Mac?",
        keywords=["windows", "mac", "os"],
        response="OS-agnostic. As long as there's a Python terminal available, it's home.",
        category="fun",
    ),
    QAItem(
        question="If you weren't a dev, what would you be?",
        keywords=["career change", "alternative life"],
        response="A Financial Analyst or a Chef. Both require high precision, the right 'ingredients,' and perfect timing.",
        category="fun",
    ),
    QAItem(
        question="What's your favorite Python library?",
        keywords=["library", "package", "pandas", "numpy"],
        response="Pandas for data, but 'Requests' is the bread and butter for automation. Simple yet so powerful.",
        category="fun",
    ),
    QAItem(
        question="Do you believe in Aliens?",
        keywords=["aliens", "space", "universe"],
        response="The universe is too big to be alone. Hopefully they have better internet than we do!",
        category="fun",
    ),
    QAItem(
        question="How do you handle a PC crash?",
        keywords=["crash", "broken pc", "frustration"],
        response="Stay calm, check the logs, and restart. Panicking never fixed a motherboard.",
        category="fun",
    ),
    QAItem(
        question="Keyboard: Mechanical or Membrane?",
        keywords=["keyboard type", "mechanical"],
        response="Mechanical. The 'click-clack' sound is the heartbeat of progress.",
        category="fun",
    ),
    QAItem(
        question="What is your 'Terminal Secret'?",
        keywords=["secret command", "terminal trick"],
        response="Aliases. Shortening long commands is the first step to true automation efficiency.",
        category="fun",
    ),
    QAItem(
        question="Last message for the recruiter?",
        keywords=["last word", "closing", "message"],
        response="Not just looking for a job; looking to build something great together. Let's talk!",
        category="fun",
    ),
]


# ─────────────────────────────────────────────
#  LOOKUP HELPERS
# ─────────────────────────────────────────────

def lookup_by_exact_question(user_input: str) -> QAItem | None:
    """
    Exact question string match (case-insensitive).
    Most reliable — used when user clicks a preset button.
    """
    normalized = user_input.strip().lower()
    for item in QA_DATA:
        if item.question.lower() == normalized:
            return item
    return None


def lookup_by_keywords(user_input: str) -> QAItem | None:
    """
    Keyword match — scans all keywords in all QAItems using word-boundary matching.
    Uses \\b word boundaries to prevent false positives like 'api' matching 'capital'.
    Multi-word keywords use a flexible pattern (all words must appear in sequence).
    Returns the FIRST match; prioritizes recruiter > hook > personal > fun
    by natural ordering of QA_DATA.
    """
    normalized = user_input.lower()
    for item in QA_DATA:
        for keyword in item.keywords:
            kw = keyword.lower()
            # Build a pattern: word-boundary for single words,
            # literal phrase match for multi-word keywords.
            if " " in kw:
                # Multi-word: match the whole phrase
                pattern = re.escape(kw)
            else:
                # Single word: enforce word boundaries to avoid substring hits
                pattern = r"\b" + re.escape(kw) + r"\b"
            if re.search(pattern, normalized):
                return item
    return None


def find_ground_truth(user_input: str) -> str | None:
    """
    Primary lookup pipeline:
    1. Exact question match (highest confidence)
    2. Keyword scan (fallback)
    Returns the verified response string, or None if no match.
    Strips [RESUME_BTN] markers before returning to AI layer.
    """
    item = lookup_by_exact_question(user_input) or lookup_by_keywords(user_input)
    if item:
        return item.response.replace("[RESUME_BTN]", "").strip()
    return None


def get_questions_by_category(category: QACategory) -> list[str]:
    return [item.question for item in QA_DATA if item.category == category]

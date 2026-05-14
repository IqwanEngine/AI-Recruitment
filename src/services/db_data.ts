/**
 * ============================================================
 *  DB_DATA.TS — Master Professional Profile Database V5.0
 *  IqwanEngine | by Muhammad Hairul Iqwan
 * ============================================================
 *
 *  SOURCE OF TRUTH for Iqwan's career, projects, and
 *  AI-driven portfolio terminal.
 *
 *  MERGE LOG:
 *   - Base answers : db_data (1).ts  → LOCKED. Do NOT modify.
 *   - New Q&A added: Db_data2.txt    → Sections 2, 3, 4 appended.
 *   - recruiterQuestions             → Aligned to exact question strings.
 *
 *  ⚠️  SECURITY NOTES (IqwanEngine Protocol):
 *   - Never interpolate raw user input into {{name}} or {{keyword}}.
 *     All substitutions must pass through sanitizePlaceholder().
 *   - [RESUME_BTN] markers must be rendered as React <button>
 *     components in the UI layer — never via dangerouslySetInnerHTML.
 *   - All QA responses are plain-text. Treat them as textContent,
 *     not innerHTML, to prevent XSS.
 * ============================================================
 */

// ─────────────────────────────────────────────
//  PROFILE (Locked — db_data (1).ts source)
// ─────────────────────────────────────────────

export const iqwanProfile = {
  name: "Muhammad Hairul Iqwan",
  specialty: "Workflow Automation Specialist & Python Developer",
  location: "Banting, Malaysia",
  experience: "10+ years in customer operations & automation architecture",

  about_short:
    "Originally from Banting, Malaysia, I am a developer who believes technology should simplify human life, not complicate it. I focus on building efficient Python solutions so my teammates can stop wrestling with tedious tasks and start focusing on what truly matters.",

  about_long:
    "Iqwan's journey began with a decade in Customer Operations—where I learned the art of listening and identifying the real 'friction' in business. Today, I translate those ten years of experience into clean Python code and seamless automation (Make/Zapier). While I have developed high-precision systems like IqwanEngine for the GOLD market, I still consider myself a lifelong student. As a family man and a professional, my mission is simple: to use my technical expertise to help organizations thrive, while remaining grounded and approachable in every collaboration.",

  technical_skills:
    "I don't just write code; I build digital bridges. My toolkit centers on efficiency, utilizing Python and React for development, while leveraging Google Apps Script and Make/Zapier to close the operational gaps that often go unnoticed. I am particularly passionate about the intersection of AI and finance—not for the sake of complexity, but to find the smartest, most reliable ways to manage risk.",

  projects: {
    iqwanengine:
      "IqwanEngine is a testament to my patience and deep-seated passion for algorithmic trading. More than just a production-grade system for trading, it represents a personal milestone in blending AI with high-precision automation. I built it to prove that with the right logic and a humble respect for the data, we can navigate complex global markets with calm and clarity.",
  },

  availability:
    "I am currently seeking new opportunities where I can contribute my energy, skills, and ideas. I'm not just looking for a role; I'm looking for a team where I can help solve problems and accelerate success. I am ready to step in and add value immediately.",

  contact: {
    email: "hairuliqwan352@gmail.com",
    linkedin: "https://www.linkedin.com/in/hairul-iqwan",
  },
} as const;

// ─────────────────────────────────────────────
//  DATABASE (Locked — db_data (1).ts source)
// ─────────────────────────────────────────────

export const iqwanDatabase = {
  // --- 1. EXECUTIVE SUMMARY ---
  profileSummary: {
    fullName: "Muhammad Hairul Iqwan Bin Mohd Yaziz",
    preferredName: "Hairul Iqwan",
    specialty: "Workflow Automation, Python Developer & AI Integrator",
    location: "Banting, Selangor / Cyberjaya, Malaysia",
    experienceLabel:
      "10+ years in customer operations & automation architecture",
    aboutShort:
      "Iqwan is a Workflow Automation Specialist and Python Developer based in Malaysia. He specializes in building scalable systems and is the creator of the IqwanEngine algorithmic trading system.",
    philosophy: "Identify a bottleneck, and automate the solution.",
    motto: "Build smart. Automate everything. Optimize continuously.",
    availability: "Status: OPEN TO WORK. Protocol: Immediate Deployment.",
    contact: {
      email: "hairuliqwan352@gmail.com",
      linkedin: "https://www.linkedin.com/in/iqwanengine-automation",
    },
  },

  // --- 2. CORE IDENTITY & VALUES ---
  coreValues: {
    integrity: "High focus on transparency and data honesty.",
    growthMindset: "Self-taught programmer. Constant self-driven learning.",
    dedication: "High stamina for deep-focus sessions.",
    problemSolving: "Proactive engineering approach.",
  },

  // --- 3. PERSONAL CONTEXT ---
  personalContext: {
    family: {
      wife: "EyllaDylla (Dilla)",
      children: ["Aisy Adryan (Son)", "Raisya Ayleen (Daughter)"],
    },
    healthRegimen: "Maintains a strict supplement routine to manage health.",
    lifestyle: {
      community: "Founder of a 7,000+ member tech community.",
      preferences: "Cyberpunk aesthetic, electric blue UI.",
    },
  },

  // --- 4. IQWAN_ENGINE ---
  iqwanEngine: {
    systemName: "IqwanEngine FX V3",
    marketFocus: "XAUUSD (Gold)",
    architecture: "AI-Integrated Algorithmic Trading System",
    coreFeatures: [
      "Real-time Sentiment Analysis",
      "Automated Risk Management",
      "Advanced Trend Detection Logic",
      "High-Precision Execution Protocol",
    ],
    techStack: ["Python", "MT5 API", "Gemini AI", "Pandas", "NumPy"],
  },
} as const;

// ─────────────────────────────────────────────
//  TYPE DEFINITIONS
// ─────────────────────────────────────────────

/** Category labels for UI grouping of buttons */
export type QACategory = "recruiter" | "hook" | "personal" | "fun";

export interface QAItem {
  /** The exact question string. Used for button labels and strict matching. */
  question: string;
  /** Keywords for fallback fuzzy matching (used in aiLogic only, not chatLogic). */
  keywords: string[];
  /** The response template. May contain {{keyword}} or {{name}} placeholders. */
  response: string;
  /** UI grouping for rendering button sections */
  category: QACategory;
}

// ─────────────────────────────────────────────
//  QA DATABASE
//  SECTION 1 : RECRUITER (base from db_data (1).ts — answers LOCKED)
//  SECTION 2 : HOOK      (new — from Db_data2.txt)
//  SECTION 3 : PERSONAL  (new — from Db_data2.txt)
//  SECTION 4 : FUN       (new — from Db_data2.txt)
// ─────────────────────────────────────────────

export const qaData: QAItem[] = [
  // ══════════════════════════════════════════
  //  SECTION 1 — RECRUITER QUESTIONS
  //  Source: db_data (1).ts | Answers LOCKED
  // ══════════════════════════════════════════

  {
    question: "What is Iqwan's primary tech stack?",
    keywords: [
      "tech stack",
      "languages",
      "programming",
      "tools",
      "core stack",
      "technical skills",
    ],
    response:
      "Driven by a love for continuous learning, Iqwan applies Python and React to create practical tools. He is also developing his skills in Workflow Automation and Google Apps Script, always looking for simple ways to help teams become more efficient. He is committed to giving his full effort to deliver the best results for your organization. [RESUME_BTN]",
    category: "recruiter",
  },
  {
    question: "How does Iqwan manage high-pressure environments?",
    keywords: [
      "pressure",
      "stress",
      "difficult",
      "fast-paced",
      "handle stress",
      "manage pressure",
    ],
    response:
      "Working in Customer Operations taught him that things don't always go to plan. He handles pressure by staying calm and breaking down big problems into smaller, manageable steps. He believes that a steady head not only solves technical issues faster but also helps keep the team's morale up. He is ready to bring this resilient mindset to your team.",
    category: "recruiter",
  },
  {
    question: "Is Iqwan open to remote or hybrid roles?",
    keywords: ["remote", "work from home", "wfh", "anywhere", "hybrid setup"],
    response:
      "Yes, he is very comfortable with digital collaboration and remote setups. Currently based in Cyberjaya, he is happy to adapt to the team's preferred working style to ensure maximum output and clear communication.",
    category: "recruiter",
  },
  {
    question: "Is Iqwan willing to travel or relocate?",
    keywords: ["travel", "relocate", "moving", "overseas", "relocation"],
    response:
      "Iqwan is open to both domestic and international travel. He is also open to discussing relocation if it aligns with the needs and growth of the project. He is flexible and ready to commit wherever his skills are needed most.",
    category: "recruiter",
  },
  {
    question: "What is Iqwan's current availability to start?",
    keywords: ["available", "start date", "availability", "notice", "join"],
    response:
      "He is ready to contribute and can start as soon as needed. He values a smooth transition and is happy to discuss the best timeline for the team. He is prepared to give his 100% commitment from day one.",
    category: "recruiter",
  },
  {
    question: "What are Iqwan's salary expectations?",
    keywords: ["salary", "expected", "pay", "compensation", "money"],
    response:
      "Regarding your question about {{keyword}}, Iqwan believes in a mutually beneficial arrangement where the offer reflects the value he brings to the team. While he looks for something aligned with market rates, he is more focused on the right fit and the impact he can make. He's always open to a transparent conversation about these details once there's a better understanding of the team's specific needs. [RESUME_BTN]",
    category: "recruiter",
  },
  {
    question: "What is Iqwan's professional background?",
    keywords: [
      "experience",
      "years",
      "background",
      "history",
      "career",
      "concentrix",
    ],
    response:
      "With 10 years of experience, he bridges the gap between daily operations and technical automation. He doesn't just build tools for the sake of tech; he uses his background to ensure every script or system he develops solves a real human problem for his team. He is eager to bring this problem-solving experience to your project. [RESUME_BTN]",
    category: "recruiter",
  },
  {
    question: "Does he have experience with AI integration?",
    keywords: ["ai", "llm", "gpt", "gemini", "artificial intelligence"],
    response:
      "Yes, he's actually quite hands-on with it. He actively explores ways to integrate {{keyword}} into daily workflows—not just for the sake of using new tech, but as a practical way to help the team make better decisions and save time. He is dedicated to mastering AI tools to keep your workflows modern and efficient. [RESUME_BTN]",
    category: "recruiter",
  },
  {
    question: "Can you tell me about the IqwanEngine project?",
    keywords: [
      "iqwanengine",
      "trading",
      "algorithmic",
      "xauusd",
      "gold",
      "trading system",
    ],
    response:
      "IqwanEngine is his flagship project—a production-grade, AI-integrated algorithmic trading system specifically built for the XAUUSD (Gold) market. It uses Python, MT5 API, and Gemini AI. This system reflects his humble beginnings as a self-taught coder and his vision for high-level automated architecture. [RESUME_BTN]",
    category: "recruiter",
  },
  {
    question: "What is Iqwan's most impactful operational achievement?",
    keywords: [
      "achievement",
      "impact",
      "reduce",
      "time",
      "efficiency",
      "success",
    ],
    response:
      "During his time as an Automation Specialist, he engineered a centralized Knowledge Base that reduced information retrieval time by 80%. He also built automated scripts that cut ticketing time significantly. He is humble about these results but remains hungry to achieve even greater efficiency for your team. [RESUME_BTN]",
    category: "recruiter",
  },
  {
    question: "Why should we hire you over other candidates?",
    keywords: [
      "why hire you",
      "reason",
      "value",
      "hire him",
      "edge",
      "advantage",
    ],
    response:
      "Iqwan brings a rare combination: he understands both business operations and technical logic. With 10+ years handling real-world friction, he builds automations that solve actual problems. He is a dedicated learner who will always do his best to ensure your team stays ahead. I would love the chance to discuss how I can add value to your company. [RESUME_BTN]",
    category: "recruiter",
  },
  {
    question: "What is your vision for the next 2 to 5 years?",
    keywords: [
      "5 years",
      "2 years",
      "future",
      "vision",
      "career path",
      "long term",
    ],
    response:
      "Over the next few years, Iqwan aims to evolve into a Lead Automation Architect. He wants to spearhead enterprise-level AI integrations and build scalable, self-sustaining systems. He is a visionary who is ready to grow alongside your company and contribute to its long-term success.",
    category: "recruiter",
  },
  {
    question: "How does Iqwan approach team collaboration?",
    keywords: [
      "team",
      "collab",
      "collaboration",
      "teamwork",
      "together",
      "leadership",
      "mentorship",
    ],
    response:
      "Iqwan believes that the best code is written together. He actively listens to his team's needs and enjoys mentoring peers in automation best practices. His priority is always fostering a supportive, transparent environment where everyone can thrive. [RESUME_BTN]",
    category: "recruiter",
  },
  {
    question: "What is Iqwan's core approach to problem-solving?",
    keywords: [
      "problem-solving",
      "approach",
      "bottleneck",
      "solve",
      "solution",
      "troubleshoot",
    ],
    response:
      "He follows a proactive engineering mindset. Instead of applying temporary fixes to repetitive manual tasks, he digs deep to find the root cause (the bottleneck) and architects an automated system to eliminate it completely. [RESUME_BTN]",
    category: "recruiter",
  },

  // ══════════════════════════════════════════
  //  SECTION 2 — HOOK / 'WOW FACTOR' QUESTIONS
  //  Source: Db_data2.txt | New additions
  // ══════════════════════════════════════════

  {
    question: "What makes Iqwan different from other devs?",
    keywords: ["different", "unique", "edge", "why you"],
    response:
      "Most devs code for the machine; I code for the operation. My background in CS means I understand the 'why' before I even touch the 'how' in {{keyword}}.",
    category: "hook",
  },
  {
    question: "Can IqwanEngine really beat the market?",
    keywords: ["beat the market", "profitable", "risk", "accuracy"],
    response:
      "No system is perfect, but IqwanEngine is built on rigorous risk management. It's about consistency and removing human emotion from the equation.",
    category: "hook",
  },
  {
    question: "Why focus on automation instead of full-stack?",
    keywords: ["focus", "automation vs coding", "specialization"],
    response:
      "Because automation is where the immediate ROI is for a company. I'd rather reclaim 100 hours for a team than just build another pretty landing page.",
    category: "hook",
  },
  {
    question: "What is your 'Secret Sauce' in coding?",
    keywords: ["secret", "method", "workflow"],
    response:
      "Simplicity. If a script needs a 10-page manual to run, it's not a good script. My {{keyword}} approach is 'Plug and Play'.",
    category: "hook",
  },
  {
    question: "What's the biggest bug you've ever fixed?",
    keywords: ["bug", "error", "debug", "mistake"],
    response:
      "Once an automation loop almost wiped a database. It taught me the importance of 'Fail-Safe' protocols and rigorous testing in {{keyword}}.",
    category: "hook",
  },
  {
    question: "How do you handle rapid tech changes?",
    keywords: ["change", "learning", "updated", "trends"],
    response:
      "I dedicate 1 hour every night to 'Deep Learning.' Whether it's a new Python library or a Gemini update, I stay curious.",
    category: "hook",
  },
  {
    question: "What is your 'Automation Philosophy'?",
    keywords: ["philosophy", "motto", "principle"],
    response:
      "If you have to do it more than twice, automate it. Human creativity is too valuable to waste on repetitive clicking.",
    category: "hook",
  },
  {
    question: "Is Python really the best for automation?",
    keywords: ["why python", "javascript vs python"],
    response:
      "For data-heavy and logic-complex tasks, Python is king. Its ecosystem for {{keyword}} is unmatched, especially with AI integration.",
    category: "hook",
  },
  {
    question: "How do you measure project success?",
    keywords: ["success", "metric", "kpi"],
    response:
      "Success = Time Saved + Error Rate Reduction. If my automation doesn't hit those two, we haven't finished yet.",
    category: "hook",
  },
  {
    question: "Do you build custom AI models?",
    keywords: ["custom ai", "training", "fine tuning"],
    response:
      "I specialize in 'Instruction Engineering' and API orchestration. Fine-tuning models is great, but smart prompting often solves 90% of business needs faster.",
    category: "hook",
  },

  // ══════════════════════════════════════════
  //  SECTION 3 — PERSONAL / HUMAN CONNECTION
  //  Source: Db_data2.txt | New additions
  // ══════════════════════════════════════════

  {
    question: "What motivates you every morning?",
    keywords: ["motivation", "drive", "family", "kids"],
    response:
      "My family. Being a father to Aisy and Raisya makes me want to build a future where tech enables us to spend more time with our loved ones.",
    category: "personal",
  },
  {
    question: "How do you stay healthy with a tech lifestyle?",
    keywords: ["health", "routine", "blood pressure", "supplements"],
    response:
      "I'm very disciplined with my health regimen. Managing high blood pressure taught me that a sharp mind needs a well-maintained body.",
    category: "personal",
  },
  {
    question: "Why are you based in Cyberjaya?",
    keywords: ["cyberjaya", "location", "tech hub"],
    response:
      "It's the Silicon Valley of Malaysia. Being surrounded by tech energy and innovation keeps me in the right 'Deep Work' headspace.",
    category: "personal",
  },
  {
    question: "Are you a self-taught developer?",
    keywords: ["self taught", "degree", "education"],
    response:
      "Yes. I believe a degree gets you the interview, but curiosity and projects like IqwanEngine get you the results. I am a student of the internet.",
    category: "personal",
  },
  {
    question: "What do you do in your free time?",
    keywords: ["hobby", "free time", "gaming"],
    response:
      "I explore financial markets or refine my UI aesthetics. Sometimes, a good road trip with the family is the best way to 'reboot' my brain.",
    category: "personal",
  },
  {
    question: "What's the meaning behind 'IqwanEngine'?",
    keywords: ["engine", "meaning", "brand"],
    response:
      "It represents a 'continuous motor' of growth. I don't want to just be a coder; I want to be the engine that drives a team forward.",
    category: "personal",
  },
  {
    question: "What kind of father are you?",
    keywords: ["father", "parenting", "family", "married"],
    response:
      "I'm the 'Educator' father. I want Aisy and Raisya to see that with logic and hard work, they can build anything they can imagine.",
    category: "personal",
  },
  {
    question: "Do you like Cyberpunk aesthetics?",
    keywords: ["cyberpunk", "style", "design", "blue"],
    response:
      "Absolutely. The 'Neon Blue' and 'Dark Mode' vibe represents the future—clean, high-tech, and efficient. Exactly like my code.",
    category: "personal",
  },
  {
    question: "What is your dream role?",
    keywords: ["dream job", "ambition"],
    response:
      "To be a Lead Automation Architect in a company that isn't afraid to break traditional workflows to achieve 10x growth.",
    category: "personal",
  },
  {
    question: "Who is your tech inspiration?",
    keywords: ["hero", "inspiration", "mentor"],
    response:
      "Anyone who can take a complex problem and explain it to a 5-year-old. That level of mastery is what I strive for.",
    category: "personal",
  },

  // ══════════════════════════════════════════
  //  SECTION 4 — FUN / AI PERSONA QUESTIONS
  //  Source: Db_data2.txt | New additions
  // ══════════════════════════════════════════

  {
    question: "Coffee or Tea?",
    keywords: ["coffee", "tea", "drink"],
    response:
      "Coffee for coding, Tea for family time. But honestly, {{keyword}} runs on pure logic and maybe a bit of caffeine!",
    category: "fun",
  },
  {
    question: "Light Mode or Dark Mode?",
    keywords: ["light mode", "dark mode", "theme"],
    response:
      "Dark Mode. Always. We are building the future in the shadows of the terminal.",
    category: "fun",
  },
  {
    question: "What's your favorite coding snack?",
    keywords: ["snack", "food", "eat"],
    response:
      "Anything that doesn't make the keyboard greasy! But usually, I'm too focused on the work to even remember to eat.",
    category: "fun",
  },
  {
    question: "If you were an AI, which one would you be?",
    keywords: ["which ai", "robot"],
    response:
      "I'd be a specialized Agent—quietly working in the background, making sure everything runs perfectly without being noticed.",
    category: "fun",
  },
  {
    question: "What was your first computer?",
    keywords: ["first pc", "old tech", "nostalgia"],
    response:
      "A humble machine that crashed a lot. It taught me the most important lesson in tech: Save your work often!",
    category: "fun",
  },
  {
    question: "Can you explain Gold trading to a 5-year-old?",
    keywords: ["explain like i'm 5", "eli5"],
    response:
      "It's like playing a game of 'Guess the Price.' But instead of guessing, we use a super-smart robot (IqwanEngine) to help us win.",
    category: "fun",
  },
  {
    question: "Vim or VS Code?",
    keywords: ["vim", "vscode", "editor"],
    response:
      "VS Code for the UI, but I respect the 'hardcore' Vim users. Currently, I'm loving the Zed Editor for its speed!",
    category: "fun",
  },
  {
    question: "What's the most useless app you ever made?",
    keywords: ["useless", "funny project"],
    response:
      "A script that just sent me a notification saying 'You are still coding' every 5 minutes. I deleted it very quickly!",
    category: "fun",
  },
  {
    question: "What happens if AI takes over the world?",
    keywords: ["ai takeover", "future of ai"],
    response:
      "Then I hope the AI was programmed by someone who values 'Human-Centric' logic, just like I do.",
    category: "fun",
  },
  {
    question: "Can you write code in your sleep?",
    keywords: ["sleep", "dreaming code"],
    response:
      "Sometimes I do wake up with the solution to a bug! My brain never really stops the process.",
    category: "fun",
  },
  {
    question: "Tab or Space?",
    keywords: ["tab", "space", "indentation"],
    response:
      "Spaces. 4 of them. Let's not start a war! Logic and consistency are what matter.",
    category: "fun",
  },
  {
    question: "What's your 'Power Song' while coding?",
    keywords: ["music", "coding playlist", "song"],
    response:
      "Anything Lo-Fi or Synthwave. It fits the Cyberpunk vibe of my terminal perfectly.",
    category: "fun",
  },
  {
    question: "Window or Mac?",
    keywords: ["windows", "mac", "os"],
    response:
      "I'm OS-agnostic. As long as I can run a Python terminal, I'm home.",
    category: "fun",
  },
  {
    question: "If you weren't a dev, what would you be?",
    keywords: ["career change", "alternative life"],
    response:
      "A Financial Analyst or a Chef. Both require high precision, the right 'ingredients,' and perfect timing.",
    category: "fun",
  },
  {
    question: "What's your favorite Python library?",
    keywords: ["library", "package", "pandas", "numpy"],
    response:
      "Pandas for data, but 'Requests' is my bread and butter for automation. It's so simple yet so powerful.",
    category: "fun",
  },
  {
    question: "Do you believe in Aliens?",
    keywords: ["aliens", "space", "universe"],
    response:
      "The universe is too big for us to be alone. I just hope they have better internet than we do!",
    category: "fun",
  },
  {
    question: "How do you handle a PC crash?",
    keywords: ["crash", "broken pc", "frustration"],
    response:
      "Stay calm, check the logs, and restart. Panicking never fixed a motherboard.",
    category: "fun",
  },
  {
    question: "Keyboard: Mechanical or Membrane?",
    keywords: ["keyboard type", "mechanical"],
    response:
      "Mechanical. The 'click-clack' sound is the heartbeat of my progress.",
    category: "fun",
  },
  {
    question: "What is your 'Terminal Secret'?",
    keywords: ["secret command", "terminal trick"],
    response:
      "Aliases. Shortening long commands is the first step to true automation efficiency.",
    category: "fun",
  },
  {
    question: "Last message for the recruiter?",
    keywords: ["last word", "closing", "message"],
    response:
      "I'm not just looking for a job; I'm looking to build something great together. Let's talk! [RESUME_BTN]",
    category: "fun",
  },
];

// ─────────────────────────────────────────────
//  DERIVED HELPERS
// ─────────────────────────────────────────────

/**
 * Returns all QAItems that have a valid question string.
 * Safe: filters out any entry with an empty or missing question.
 */
export const getAllQAItems = (): QAItem[] =>
  qaData.filter(
    (item) =>
      typeof item.question === "string" && item.question.trim().length > 0,
  );

/**
 * Returns QAItems grouped by category for sectioned button rendering.
 */
export const getQAByCategory = (): Record<QACategory, QAItem[]> =>
  qaData.reduce(
    (acc, item) => {
      acc[item.category].push(item);
      return acc;
    },
    { recruiter: [], hook: [], personal: [], fun: [] } as Record<
      QACategory,
      QAItem[]
    >,
  );

/**
 * Featured recruiter questions for the primary button row.
 * These are the exact question strings from qaData (category: "recruiter").
 * Aligned so button-click exact-match logic works without mismatch.
 */
export const recruiterQuestions: readonly string[] = qaData
  .filter((item) => item.category === "recruiter")
  .map((item) => item.question);

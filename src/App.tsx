// == IqwanEngine: App.tsx (Voice Engine Restored & Upgraded) ==
const API_BASE_URL = "";
import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Send,
  Terminal,
  Linkedin,
  Github,
  ExternalLink,
  Phone,
  Mail,
  RefreshCw,
  Rocket,
  Code,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Heart,
  Palette,
  Monitor,
  Volume2,
  VolumeX,
  RotateCcw,
  ChevronRight,
  Zap,
  X,
} from "lucide-react";
import { ParticleBackground } from "./components/ParticleBackground";
import { BlockchainVisualizer } from "./components/BlockchainVisualizer";
import { Message } from "./types";
import { JDMatcher } from "./components/JDMatcher";

type Theme = "blue" | "crimson" | "acid";

const RECRUITER_QUESTIONS = [
  "What is Iqwan's primary tech stack?",
  "Can you tell me about the IqwanEngine project?",
  "Is Iqwan open to remote or hybrid roles?",
  "What is Iqwan's current availability to start?",
  "Does he have experience with AI integration?",
  "What are Iqwan's salary expectations?",
  "How does Iqwan approach team collaboration?",
  "What is Iqwan's most impactful operational achievement?",
  "What is Iqwan's professional background?",
  "What is Iqwan's core approach to problem-solving?",
  "How does Iqwan's trading background benefit a non-finance IT role?",
  "What complex API challenges has he solved recently?",
  "Can he explain the UI/UX philosophy behind IqwanEngine?",
  "How does he ensure code scalability in his automation scripts?",
  "What is his approach to learning a completely new tech stack?",
  "How does he balance technical execution with business operational needs?",
];

// --- SUB-COMPONENT: SLIDE TO ACTIVATE (THE POWER BUTTON) ---
const SlideToActivate = () => {
  const [isActivated, setIsActivated] = useState(false);
  const x = useMotionValue(0);

  const background = useTransform(
    x,
    [0, 180],
    ["rgba(0, 241, 254, 0.05)", "rgba(0, 241, 254, 0.3)"],
  );

  const opacity = useTransform(x, [0, 100], [1, 0]);

  const handleDragEnd = () => {
    if (x.get() > 150) {
      setIsActivated(true);
      const link = document.createElement("a");
      link.href = "./media/Muhammad_Hairul_Iqwan_Resume.pdf";
      link.download = "Iqwan_Resume.pdf";
      link.click();

      setTimeout(() => {
        setIsActivated(false);
        x.set(0);
      }, 3000);
    } else {
      x.set(0);
    }
  };

  return (
    <div className="relative mt-6 h-[48px] bg-black/50 border border-white/10 rounded-xl p-1.5 flex items-center overflow-hidden group">
      <motion.div
        style={{ width: x, background }}
        className="absolute left-0 top-0 bottom-0 z-0"
      />
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="text-[8px] text-white/30 tracking-[0.3em] font-black uppercase font-orbitron">
          Download Resume
        </span>
      </motion.div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 180 }}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className="relative z-10 w-[52px] h-full bg-gradient-to-br from-cyber-blue to-blue-600 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center shadow-[0_0_20px_rgba(0,241,254,0.3)]"
      >
        {isActivated ? (
          <Check size={20} className="text-black animate-bounce" />
        ) : (
          <Rocket
            size={20}
            className="text-black -rotate-45 group-hover:rotate-0 transition-transform duration-500"
          />
        )}
      </motion.div>
      <div className="ml-auto pr-4 pointer-events-none opacity-20">
        <ChevronRight size={18} className="animate-pulse" />
      </div>
    </div>
  );
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("blue");
  const [messageCount, setMessageCount] = useState(0);
  const [showAnalyzeButton, setShowAnalyzeButton] = useState(false);
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [leadState, setLeadState] = useState<
    "none" | "awaiting_contact" | "awaiting_additional"
  >("none");
  const [tempLeadContact, setTempLeadContact] = useState("");

  // == IqwanEngine Voice State Management ==
  const [isMuted, _setIsMuted] = useState(false);
  const isMutedRef = useRef(false); // Ref untuk elak closure bug masa setTimeout
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]); // Ref untuk simpan senarai suara

  const [userName, setUserName] = useState<string>("");
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fungsi khas untuk Toggle Mute dengan serta-merta
  const toggleMute = () => {
    const newState = !isMuted;
    _setIsMuted(newState);
    isMutedRef.current = newState;
    if (newState && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Terus diam kalau ditekan mute
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }

    // Load available voices asynchronously
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    const savedName = localStorage.getItem("saved_company_name");
    const savedHistory = localStorage.getItem("saved_chat_history");

    if (savedName) {
      setUserName(savedName);
      setShowOnboarding(false);

      if (savedHistory) {
        setMessages(JSON.parse(savedHistory));
      } else {
        const initialMsg: Message = {
          id: "1",
          role: "ai",
          content: `Thank you ${savedName} for being here, is there anything you want to know about Hairul Iqwan?`,
          instruction:
            "You can type any random question below, or select a quick option:",
          suggestions: ["About Iqwan (Short)", "About Iqwan (Long)"],
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "SYNC_READY",
        };
        setMessages([initialMsg]);
        speak(initialMsg.content);
      }
    } else {
      setMessages([]);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove("theme-crimson", "theme-acid");
    if (newTheme === "crimson")
      document.documentElement.classList.add("theme-crimson");
    if (newTheme === "acid")
      document.documentElement.classList.add("theme-acid");
    localStorage.setItem("app-theme", newTheme);
  };

  const handleResetSession = () => {
    if (
      window.confirm(
        "IQWANENGINE_ASSISTANT: This will clear all session data. Proceed?",
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("saved_chat_history", JSON.stringify(messages));
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, userName]);

  // == IqwanEngine: Advanced Speech Synthesis ==
  const speak = (text: string) => {
    if ("speechSynthesis" in window && !isMutedRef.current) {
      window.speechSynthesis.cancel();

      const cleanText = text.replace("[RESUME_BTN]", "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      utterance.rate = 1.0;
      utterance.pitch = 0.85;

      const preferredVoices = [
        "Google UK English Male",
        "Google US English",
        "Google UK English Female",
        "Microsoft Mark",
        "Samantha",
        "Daniel",
      ];

      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;

      // Loop senarai keutamaan untuk cari suara yang wujud dalam browser user
      for (const name of preferredVoices) {
        selectedVoice = voices.find((v) => v.name.includes(name));
        if (selectedVoice) break; // Berhenti bila dah jumpa yang terbaik
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: "positive" | "negative") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: type } : m)),
    );
  };

  const getDynamicSuggestions = (
    newFromAI?: string[],
    currentAsked: string[] = [],
  ): string[] => {
    // Combine state and current asked for safety
    const allAsked = Array.from(new Set([...askedQuestions, ...currentAsked]));

    // If AI provided new context-specific suggestions, use them
    if (newFromAI && newFromAI.length > 0) {
      return newFromAI.filter((s) => !allAsked.includes(s));
    }

    // Fallback: Pick from RECRUITER_QUESTIONS that haven't been asked
    const available = RECRUITER_QUESTIONS.filter((q) => !allAsked.includes(q));
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    //==IqwanEngine: Lead Capture Logic
    if (leadState === "awaiting_contact") {
      setTempLeadContact(text);
      setLeadState("awaiting_additional");
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      // Save Lead to DB & Trigger Tier 2 Notification via backend
      fetch(`${API_BASE_URL}/api/save_lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: userName,
          contactInfo: text,
          additionalInfo: "Lead captured via interactive chat",
        }),
      }).catch((err) => console.error("Lead Capture Error:", err));

      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content:
            "Thank you! Is there any additional information you'd like to share with Iqwan? You can also reach him directly here: [ 💬 WhatsApp Iqwan ](https://wa.me/60172135072)",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "SYNC_READY",
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        speak(
          "Thank you! Is there any additional information you'd like to share with Iqwan?",
        );
      }, 1000);
      return;
    }

    if (leadState === "awaiting_additional") {
      setLeadState("none");
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      // Save Lead to DB
      fetch(`${API_BASE_URL}/api/save_lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: userName,
          contactInfo: tempLeadContact,
          additionalInfo: text,
        }),
      }).catch((err) => console.error("Lead Capture Error:", err));

      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content:
            "Thank you! I have securely recorded your interest and details. Iqwan will be notified immediately. Is there anything else you'd like to explore?",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "SYNC_READY",
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        speak(
          "Thank you! I have securely recorded your interest and details. Iqwan will be notified immediately.",
        );
      }, 1000);
      return;
    }

    // Track the question to prevent repetition
    const updatedAsked = Array.from(new Set([...askedQuestions, text]));
    setAskedQuestions(updatedAsked);

    setMessages((prev) =>
      prev.map((m) => ({
        ...m,
        suggestions: undefined,
        instruction: undefined,
      })),
    );

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);
    setMessageCount((prev) => prev + 1);

    // Check for hiring intent or message count for Analyze button
    const currentCount = messageCount + 1; // Kita kira mesej yang baru dihantar ni
    setMessageCount(currentCount);
    const hiringKeywords = [
      "hire",
      "job",
      "role",
      "position",
      "recruitment",
      "resume",
      "fit",
      "match",
      "hiring",
      "interested",
      "tackle",
    ];

    const showInterest = hiringKeywords.some((kw) =>
      text.toLowerCase().includes(kw),
    );

    if (showInterest) {
      setShowAnalyzeButton(true);
    }

    try {
      // Convert messages to Groq format for history
      const history = messages.slice(-6).map((m) => ({
        role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      }));

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          history,
          companyName: userName,
          askedQuestions: updatedAsked,
        }),
      });
      if (!response.ok) throw new Error("Flask Server Not Responding");

      const data = await response.json();
      const parsed =
        typeof data.response === "string"
          ? JSON.parse(data.response)
          : data.response;

      const responseText =
        parsed?.answer ||
        parsed?.response ||
        parsed?.reply ||
        "IQWANENGINE_CORE: Maaf, format jawapan tidak dikenali.";
      const aiSuggestions = parsed?.new_suggestions || [];

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: responseText,
        suggestions: getDynamicSuggestions(aiSuggestions, updatedAsked),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "PROCESSING",
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      speak(responseText);

      //==IqwanEngine: Lead Gen State Transition
      const transitionKeywords = [
        "email",
        "contact number",
        "contact details",
        "follow up",
        "leave your contact",
        "reach out",
      ];
      if (
        showInterest ||
        transitionKeywords.some((kw) => responseText.toLowerCase().includes(kw))
      ) {
        if (leadState === "none") {
          setLeadState("awaiting_contact");
          // Optionally append a question if the AI didn't already ask for contact
          if (
            !responseText.toLowerCase().includes("email") &&
            !responseText.toLowerCase().includes("contact")
          ) {
            const followUp: Message = {
              id: (Date.now() + 2).toString(),
              role: "ai",
              content:
                "Since you're interested, could you please share your email or contact number so Iqwan can follow up?",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              status: "SYNC_READY",
            };
            setMessages((prev) => [...prev, followUp]);
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "ai",
          content:
            "Iqwan, sistem dikesan mengalami ralat teknikal semasa memproses data. Sila semak terminal Flask.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get("companyName") as string;
    if (name.trim()) {
      setUserName(name);
      localStorage.setItem("saved_company_name", name);
      setShowOnboarding(false);

      //==IqwanEngine: Notify visit (Tier 1)
      fetch(`${API_BASE_URL}/api/notify_visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: name }),
      }).catch((err) => console.error("Notify Visit Error:", err));

      const initialMsg: Message = {
        id: "1",
        role: "ai",
        content: `Thank you ${name} for being here, is there anything you want to know about Hairul Iqwan?`,
        instruction:
          "You can type any random question below, or select a quick option:",
        suggestions: ["About Iqwan (Short)", "About Iqwan (Long)"],
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "SYNC_READY",
      };
      setMessages([initialMsg]);

      // Panggil sistem suara selepas onboarding
      speak(initialMsg.content);
    }
  };

  return (
    <div className="flex h-screen flex-col relative z-10 font-mono overflow-hidden">
      {/* Top Status Bar */}
      <div className="h-10 w-full glass-panel border-b border-white/10 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="heart-glow">
              <Heart
                size={14}
                className="text-green-500 fill-green-500 animate-pulse"
              />
            </div>
            <span className="text-[10px] font-orbitron tracking-[0.2em] text-green-400 font-bold">
              OPEN TO WORK
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-[10px] text-white/40 tracking-widest uppercase">
            System Status: Nominal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10">
            <Palette size={12} className="text-cyber-blue" />
            <div className="flex gap-2">
              <button
                onClick={() => toggleTheme("blue")}
                className={`w-3 h-3 rounded-full bg-[#00f1fe] ring-offset-2 ring-offset-black ${theme === "blue" ? "ring-2 ring-white" : ""}`}
              />
              <button
                onClick={() => toggleTheme("crimson")}
                className={`w-3 h-3 rounded-full bg-[#ff003c] ring-offset-2 ring-offset-black ${theme === "crimson" ? "ring-2 ring-white" : ""}`}
              />
              <button
                onClick={() => toggleTheme("acid")}
                className={`w-3 h-3 rounded-full bg-[#bfff00] ring-offset-2 ring-offset-black ${theme === "acid" ? "ring-2 ring-white" : ""}`}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/30 hover:text-cyber-blue transition-colors cursor-pointer">
            <Monitor size={14} />
            <span className="text-[10px] font-orbitron">
              IqwanEngine.dev v7.2
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <button
            onClick={handleResetSession}
            className="flex items-center gap-2 text-white/30 hover:text-red-400 transition-all cursor-pointer group"
            title="Reset Session"
          >
            <RotateCcw
              size={14}
              className="group-hover:rotate-[-180deg] transition-transform duration-500"
            />
            <span className="text-[10px] font-orbitron">RESET_SESSION</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Sidebar: Profile (25%) */}
        <aside className="w-full lg:w-1/4 h-auto lg:h-full flex flex-col items-center justify-center p-8 glass-panel border-b lg:border-b-0 lg:border-r border-white/10 z-30">
          <div className="relative mb-8 group">
            <div className="absolute -inset-1.5 bg-cyber-blue/30 rounded-full blur-2xl group-hover:bg-cyber-blue/50 transition-all duration-700 animate-pulse"></div>
            <div className="w-40 h-40 lg:w-56 lg:h-56 rounded-full border-4 border-cyber-blue p-1.5 relative z-10 overflow-hidden bg-black shadow-[0_0_30px_rgba(0,241,254,0.3)]">
              <video
                src="/media/me.1.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full rounded-full object-cover scale-110 hover:scale-125 transition-transform duration-1000"
              />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-cyber-blue mb-3 tracking-tighter font-orbitron drop-shadow-[0_0_10px_rgba(0,241,254,0.5)]">
              HAIRUL_IQWAN
            </h1>
            <div className="flex flex-col gap-1 text-[8px] uppercase tracking-[0.25em] text-white/70 font-semibold max-w-[220px] mx-auto leading-relaxed">
              <span>WORKFLOW AUTOMATION</span>
              <span>AI INTEGRATION</span>
              <span>PYTHON DEVELOPER</span>
              <span>CUSTOMER OPERATIONS OPTIMIZATION</span>
            </div>
          </div>

          <nav className="flex flex-col gap-3 w-full max-w-[240px] overflow-y-auto no-scrollbar">
            <AnimatePresence>
              {showAnalyzeButton && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-2"
                >
                  <button
                    onClick={() => setIsAnalyzeOpen(true)}
                    className="cyber-button w-full py-4 px-6 text-[10px] flex items-center justify-center gap-3 bg-cyber-blue/10 border-cyber-blue animate-pulse shadow-[0_0_20px_rgba(0,241,254,0.3)]"
                  >
                    <Zap size={16} className="text-yellow-400" />
                    ANALYZE_MATCHING_FIT
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {[
              {
                icon: <Linkedin size={14} />,
                label: "LINKEDIN",
                url: "https://www.linkedin.com/in/iqwanengine-automation/",
              },
              {
                icon: <Github size={14} />,
                label: "GITHUB",
                url: "https://github.com/IqwanEngine",
              },
              {
                icon: <ExternalLink size={14} />,
                label: "PORTFOLIO",
                url: "https://iqwanengine.github.io/HI-Portfolio/",
              },
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden bg-white/[0.02] border border-white/5 py-1.5 px-3 flex items-center gap-2 transition-all hover:border-cyber-blue/50 hover:bg-cyber-blue/5"
              >
                <div className="text-cyber-blue group-hover:scale-110 transition-transform">
                  {link.icon}
                </div>
                <span className="text-[9px] tracking-[0.3em] font-orbitron text-white/60 group-hover:text-white">
                  {link.label}
                </span>
                <div className="absolute inset-0 w-full h-[1px] bg-cyber-blue/40 -translate-y-full group-hover:animate-scan opacity-0 group-hover:opacity-100" />
              </a>
            ))}

            <div className="mt-8 flex flex-col gap-4 w-full border-t border-white/10 pt-8 px-2">
              <div className="flex items-center gap-4 text-white/40 hover:text-cyber-blue transition-colors cursor-pointer group">
                <Phone size={16} className="group-hover:animate-bounce" />
                <span className="text-[11px] tracking-widest font-medium font-mono">
                  +6017 213 5072
                </span>
              </div>
              <div className="flex items-center gap-4 text-white/40 hover:text-cyber-blue transition-colors cursor-pointer group">
                <Mail size={16} className="group-hover:animate-bounce" />
                <span className="text-[10px] tracking-widest break-all font-medium font-mono">
                  hairuliqwan352@gmail.com
                </span>
              </div>

              <SlideToActivate />

              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-[7px] text-white/20 tracking-widest font-orbitron uppercase">
                  Slide To Activate : Iqwan Resume
                </span>
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-loading-wave" />
                  <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-loading-wave delay-200" />
                  <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-loading-wave delay-400" />
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content Area (75%) */}
        <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-black/40">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center scale-150">
            <BlockchainVisualizer isActive={isTyping} />
          </div>

          {/* Chat Feed */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 lg:p-14 space-y-12 z-10 no-scrollbar relative"
          >
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.role === "user" ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", damping: 20 }}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`flex items-center gap-4 mb-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <span className="text-[10px] text-white/30 font-mono tracking-widest">
                      {msg.timestamp}
                    </span>
                    <span
                      className={`text-[11px] font-bold tracking-[0.3em] font-orbitron ${msg.role === "user" ? "text-blue-400" : "text-cyber-blue"}`}
                    >
                      {msg.role === "user"
                        ? userName.toUpperCase()
                        : "IQWAN_ASSISTANT"}
                    </span>
                  </div>

                  <div
                    className={`max-w-[90%] lg:max-w-[75%] p-6 lg:p-8 rounded-2xl border-l-4 ${
                      msg.role === "user"
                        ? "bg-blue-900/10 border-blue-400/40 rounded-tr-none text-right"
                        : "bg-cyber-blue/5 border-cyber-blue/30 rounded-tl-none"
                    } glass-panel relative group`}
                  >
                    {msg.instruction && (
                      <p className="text-[11px] italic text-white/40 mb-3 font-mono">
                        {msg.instruction}
                      </p>
                    )}

                    <div className="text-base lg:text-lg text-white/95 leading-relaxed tracking-wide font-normal">
                      {msg.content.includes("[RESUME_BTN]") ? (
                        <>
                          {msg.content.replace("[RESUME_BTN]", "")}
                          <div className="mt-4">
                            <a
                              href="./media/Muhammad_Hairul_Iqwan_Resume.pdf"
                              download="Iqwan_Resume.pdf"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue text-[10px] font-orbitron hover:bg-cyber-blue/20 transition-all shadow-[0_0_15px_rgba(0,241,254,0.2)] animate-bounce"
                            >
                              <Rocket size={13} />[ DOWNLOAD RESUME ]
                            </a>
                          </div>
                        </>
                      ) : msg.content.includes("[ WhatsApp Iqwan ]") ? (
                        <>
                          {msg.content.split("[ WhatsApp Iqwan ]")[0]}
                          <a
                            href="https://wa.me/60172135072"
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyber-blue hover:underline font-bold"
                          >
                            [ 📱 WhatsApp Iqwan ]
                          </a>
                          {msg.content.split(" (https://wa.me/60172135072)")[1]}
                        </>
                      ) : (
                        msg.content
                      )}
                    </div>

                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-4">
                        {msg.suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSendMessage(s)}
                            className="px-4 py-2 rounded-lg border border-cyber-blue/30 bg-cyber-blue/5 text-[10px] font-orbitron text-cyber-blue hover:bg-cyber-blue/20 hover:shadow-[0_0_15px_rgba(0,241,254,0.3)] transition-all uppercase tracking-widest whitespace-nowrap"
                          >
                            [ {s} ]
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.role === "ai" && (
                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {!isTyping &&
                            msg === messages[messages.length - 1] && (
                              <>
                                <RefreshCw
                                  size={14}
                                  className="text-cyber-blue animate-spin-slow"
                                />
                                <span className="text-[9px] uppercase tracking-[0.2em] font-orbitron text-cyber-blue/50">
                                  SYSTEM_SYNC::ACTIVE
                                </span>
                              </>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="text-white/20 hover:text-cyber-blue transition-colors p-1"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check size={14} />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                            <button
                              onClick={() => handleFeedback(msg.id, "positive")}
                              className={`transition-colors p-1 ${msg.feedback === "positive" ? "text-green-500" : "text-white/20 hover:text-green-400"}`}
                            >
                              <ThumbsUp size={14} />
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.id, "negative")}
                              className={`transition-colors p-1 ${msg.feedback === "negative" ? "text-red-500" : "text-white/20 hover:text-red-400"}`}
                            >
                              <ThumbsDown size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col items-start relative"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[11px] font-bold tracking-[0.3em] font-orbitron text-cyber-blue">
                      IE_CORE_AI
                    </span>
                    <span className="text-[10px] text-white/20 border border-white/10 px-2 py-1 rounded font-orbitron animate-pulse">
                      PROCESSING
                    </span>
                  </div>
                  <div className="bg-white/5 p-1 rounded-2xl glass-panel relative overflow-hidden backdrop-blur-3xl">
                    <div className="bg-cyber-blue/5 p-8 rounded-xl border-l-4 border-cyber-blue/40">
                      <div className="flex gap-10 items-center">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-orbitron">
                            IqwanEngine_active
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.4em] text-cyber-blue font-orbitron animate-pulse">
                            Mapping data shards...
                          </span>
                        </div>
                        <div className="flex gap-2 h-12 items-baseline">
                          {[0.8, 0.4, 0.9, 0.6, 0.7].map((delay, i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 bg-cyber-blue shadow-[0_0_15px_var(--accent-color)]"
                              animate={{
                                height: ["20%", "100%", "30%"],
                                opacity: [0.3, 1, 0.3],
                                scaleY: [1, 1.2, 1],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: delay,
                                ease: "easeInOut",
                                delay: i * 0.1,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full bg-cyber-blue shadow-[0_0_20px_var(--accent-color)]"
                        initial={{ left: "-100%", position: "absolute" }}
                        animate={{ left: "100%" }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "circOut",
                        }}
                      />
                    </div>
                    <div className="absolute top-0 right-0 h-full w-20 overflow-hidden pointer-events-none opacity-20">
                      <motion.div
                        className="absolute top-0 right-0 w-full h-full"
                        animate={{
                          translateX: [20, -20],
                          translateY: [-10, 10],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "linear",
                        }}
                      >
                        <div className="absolute top-1/4 right-2 w-1 h-1 rounded-full bg-cyber-blue" />
                        <div className="absolute top-2/3 right-5 w-1 h-1 rounded-full bg-cyber-blue" />
                        <div className="absolute top-1/2 right-10 w-1 h-1 rounded-full bg-cyber-blue" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Bar */}
          <div className="p-8 lg:p-12 border-t border-white/10 bg-black/60 backdrop-blur-3xl z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="max-w-5xl mx-auto flex flex-col gap-6">
              <form
                onSubmit={handleFormSubmit}
                className="relative group w-full"
              >
                <div
                  className={`absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-500 ${inputValue ? "text-cyber-blue scale-110" : "text-white/20"}`}
                >
                  <Terminal size={24} />
                </div>
                <input
                  id="chatInput"
                  name="chatInput"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoComplete="off"
                  placeholder={
                    showOnboarding
                      ? "Just a second, getting things ready..."
                      : leadState === "awaiting_contact"
                        ? "Enter your email or contact number..."
                        : leadState === "awaiting_additional"
                          ? "Any additional info for Iqwan? (or press send to skip)"
                          : "Anything on your mind? We're here to help!"
                  }
                  disabled={showOnboarding}
                  className="w-full bg-white/5 border-2 border-white/10 focus:border-cyber-blue focus:shadow-[0_0_15px_rgba(0,241,254,0.1)] focus:ring-0 focus:outline-none rounded-2xl py-6 pl-16 pr-32 text-lg text-white placeholder:text-white/10 transition-all font-mono tracking-tight disabled:opacity-50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className={`p-3.5 rounded-xl transition-all duration-500 scale-100 hover:scale-110 active:scale-95 ${
                      inputValue.trim()
                        ? "bg-cyber-blue text-black shadow-[0_0_20px_rgba(0,241,254,0.5)]"
                        : "bg-white/10 text-white/10"
                    }`}
                  >
                    <Send size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className={`p-3.5 rounded-xl transition-all duration-500 border border-white/10 hover:border-cyber-blue group ${
                      isMuted
                        ? "bg-red-500/10 text-red-400"
                        : "bg-white/5 text-cyber-blue"
                    }`}
                    title={isMuted ? "Unmute AI" : "Mute AI"}
                  >
                    {isMuted ? (
                      <VolumeX size={24} />
                    ) : (
                      <Volume2
                        size={24}
                        className="group-hover:animate-pulse"
                      />
                    )}
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-between px-2">
                <div className="flex gap-6">
                  <button
                    type="button"
                    className="text-[9px] font-bold text-white/20 hover:text-cyber-blue transition-colors tracking-[0.25em] flex items-center gap-2 group font-orbitron"
                  >
                    <RefreshCw
                      size={13}
                      className="group-hover:rotate-180 transition-transform duration-500"
                    />{" "}
                    ATTACH_MODULE
                  </button>
                  <a
                    href="https://github.com/IqwanEngine"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] font-bold text-white/20 hover:text-cyber-blue transition-colors tracking-[0.25em] flex items-center gap-2 group font-orbitron"
                  >
                    <Code
                      size={13}
                      className="group-hover:scale-110 transition-transform"
                    />{" "}
                    CODE_ENGINE
                  </a>
                </div>

                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-[8px] font-bold text-white/10 tracking-[0.3em] font-orbitron">
                    PROTOCOL: IQWANENGINE_CORE_V1
                  </span>
                  <div className="w-1 h-1 rounded-full bg-green-500/30 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isAnalyzeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl"
          >
            <div className="w-full max-w-4xl max-h-[85vh] glass-panel rounded-[2rem] overflow-hidden border-white/10 flex flex-col relative">
              <button
                onClick={() => setIsAnalyzeOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all z-50"
              >
                <X size={20} />
              </button>
              <JDMatcher
                userName={userName}
                onResult={(text) => {
                  speak(text);
                  setIsAnalyzeOpen(false);
                  // Add analysis result to chat
                  const analysisMsg: Message = {
                    id: Date.now().toString(),
                    role: "ai",
                    content: text,
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    status: "SYNC_READY",
                  };
                  setMessages((prev) => [...prev, analysisMsg]);
                }}
              />
            </div>
          </motion.div>
        )}
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="w-full max-w-md bg-black/40 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden ring-1 ring-white/5"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyber-blue/20 blur-[50px] rounded-full" />

              <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-[1px] w-8 bg-cyber-blue/50" />
                    <span className="text-[10px] font-mono tracking-[0.5em] text-cyber-blue uppercase">
                      System Access
                    </span>
                    <div className="h-[1px] w-8 bg-cyber-blue/50" />
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-white font-sans">
                    Iqwan
                    <span className="text-cyber-blue font-mono">
                      Engine
                    </span>{" "}
                    <span className="font-light opacity-50 text-2xl text-slate-300">
                      Interview
                    </span>
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-[280px] mx-auto">
                    Please identify your organization to begin the interactive
                    session.
                  </p>
                </div>

                <form onSubmit={handleOnboarding} className="w-full space-y-5">
                  <div className="relative group">
                    <input
                      id="companyName"
                      name="companyName"
                      required
                      autoFocus
                      autoComplete="off"
                      spellCheck="false"
                      placeholder="Enter Company Name..."
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-cyber-blue/40 focus:ring-4 focus:ring-cyber-blue/5 rounded-2xl px-6 py-4 text-white text-center placeholder:text-white/20 outline-none transition-all duration-500"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "#fff",
                      color: "#000",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border border-white/20 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden relative"
                  >
                    <span className="relative z-10 tracking-widest text-xs">
                      LAUNCH EXPERIENCE
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </form>

                <div className="flex flex-col items-center gap-2 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <div className="text-[9px] text-white/10 font-mono italic">
                      Encrypted Data Stream v2.4.0
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .animate-spin-slow {
          animation: spin 5s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

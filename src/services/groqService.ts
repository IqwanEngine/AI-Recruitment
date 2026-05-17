// ============================================================
//  GROQSERVICE.TS — IqwanEngine Frontend Chat Client V2.0
//  IqwanEngine | by Muhammad Hairul Iqwan
//
//  ⚠️  SECURITY FIX v2.0:
//  This file NO LONGER calls Groq directly from the browser.
//  The previous version used `dangerouslyAllowBrowser: true`
//  which exposed VITE_GROQ_API_KEY in the browser bundle —
//  any user could extract it from DevTools → Sources.
//
//  All AI calls now route through the Flask backend (app.py),
//  which holds the API key securely on the server side.
//  The frontend is now a pure HTTP client — no SDK needed.
// ============================================================

// ─────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────

/**
 * Backend base URL.
 * Set VITE_API_BASE_URL in your .env for production.
 * Example: VITE_API_BASE_URL=https://your-api.railway.app
 *
 * NOTE: VITE_ env vars ARE visible in the browser bundle — this is
 * intentional for the API URL (public), but NEVER use VITE_ for secrets.
 */
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  answer: string;
  new_suggestions: string[];
}

interface RawApiResponse {
  response?: ChatResponse | string;
  error?: string;
}

// ─────────────────────────────────────────────
//  INPUT SANITIZER (Frontend Layer)
//  Defense-in-depth: backend also sanitizes,
//  but we trim obvious junk before the network call.
// ─────────────────────────────────────────────

const MAX_INPUT_LENGTH = 500;

function sanitizeInput(text: string): string {
  return text
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[\x00-\x08\x0e-\x1f]/g, "") // Strip control chars
    .trim()
    .slice(0, MAX_INPUT_LENGTH);
}

// ─────────────────────────────────────────────
//  RESPONSE PARSER
// ─────────────────────────────────────────────

function parseResponse(raw: RawApiResponse): ChatResponse {
  if (raw.error) {
    return { answer: `IqwanEngine Error: ${raw.error}`, new_suggestions: [] };
  }

  const data = raw.response;

  // Backend returns { response: { answer, new_suggestions } }
  if (data && typeof data === "object" && "answer" in data) {
    return {
      answer: String(data.answer ?? ""),
      new_suggestions: Array.isArray(data.new_suggestions)
        ? data.new_suggestions.filter((s): s is string => typeof s === "string")
        : [],
    };
  }

  // Legacy fallback: backend returned response as a JSON string
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<ChatResponse>;
      return {
        answer: parsed.answer ?? data,
        new_suggestions: parsed.new_suggestions ?? [],
      };
    } catch {
      return { answer: data, new_suggestions: [] };
    }
  }

  return {
    answer: "IQWANENGINE_CORE: Format jawapan tidak dikenali.",
    new_suggestions: [],
  };
}

// ─────────────────────────────────────────────
//  GROQ SERVICE (HTTP Proxy to Flask Backend)
// ─────────────────────────────────────────────

export class GroqService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Normalize trailing slash
  }

  /**
   * Send a chat message to the IqwanEngine Flask backend.
   *
   * @param message         The user's raw input.
   * @param history         Prior conversation turns (user/assistant only).
   * @param companyName     Recruiter's company name (for AI personalization).
   * @param askedQuestions  Questions already asked (prevents repeated suggestions).
   */
  async chat(
    message: string,
    history: ChatMessage[] = [],
    companyName: string = "",
    askedQuestions: string[] = [],
  ): Promise<ChatResponse> {
    const cleanMessage = sanitizeInput(message);
    if (!cleanMessage) {
      return { answer: "Please enter a valid message.", new_suggestions: [] };
    }

    // Only pass last 6 turns to mirror backend's MAX_HISTORY_TURNS
    const trimmedHistory = history.slice(-6).map((m) => ({
      role: m.role,
      content: sanitizeInput(m.content),
    }));

    try {
      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleanMessage,
          history: trimmedHistory,
          companyName: sanitizeInput(companyName),
          askedQuestions,
        }),
      });

      if (!res.ok) {
        // Non-2xx: try to parse error body, else use status text
        const errData = await res.json().catch(() => null);
        const errMsg = errData?.error ?? res.statusText ?? "Unknown error";
        console.error(`[IqwanEngine] API ${res.status}: ${errMsg}`);

        if (res.status === 429) {
          return {
            answer:
              "Too many requests. Please wait a moment before asking again.",
            new_suggestions: [],
          };
        }
        return {
          answer: `IqwanEngine backend error (${res.status}). Please try again.`,
          new_suggestions: [],
        };
      }

      const data: RawApiResponse = await res.json();
      return parseResponse(data);
    } catch (error: unknown) {
      // Network-level failure (CORS, server down, etc.)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error(
          "[IqwanEngine] Network error — is the Flask backend running?",
          error,
        );
        return {
          answer:
            "IqwanEngine backend is unreachable. Please ensure the server is running.",
          new_suggestions: [],
        };
      }
      console.error("[IqwanEngine] Unexpected error:", error);
      return {
        answer:
          "SYSTEM ERROR: Neural link unstable. Could not process request.",
        new_suggestions: [],
      };
    }
  }
}

// Singleton export — matches usage pattern in App.tsx
export const groqService = new GroqService();

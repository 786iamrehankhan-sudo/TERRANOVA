import { useEffect, useRef, useState } from "react";
import { X, Send, Bot, User, Sparkles } from "lucide-react";
import { getBotResponse, SUGGESTED_QUESTIONS, type ChatMessage } from "@/lib/chatbot";

// ── Simple markdown-ish renderer (bold + line breaks only) ──────────────────
function BotText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <span>
      {lines.map((line, i) => {
        // Replace **text** with <strong>
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "👋 Hi! I'm **NOVA**, your TERRANOVA guide. Ask me about Earth analog sites, Moon & Mars targets, missions, or how the AI matching works!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setShowSuggestions(false);
    setInput("");

    const userMsg: ChatMessage = { role: "user", text: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);

    // Simulate typing delay
    setTyping(true);
    setTimeout(() => {
      const response = getBotResponse(trimmed);
      const botMsg: ChatMessage = { role: "bot", text: response, timestamp: new Date() };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (q: string) => {
    sendMessage(q);
  };

  return (
    <>
      {/* ── FAB button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9990,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: open
            ? "linear-gradient(135deg, #0f172a, #1e293b)"
            : "linear-gradient(135deg, #0ea5e9, #38bdf8)",
          border: open ? "2px solid rgba(56,189,248,0.4)" : "none",
          boxShadow: "0 4px 24px rgba(14,165,233,0.5)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
          transform: open ? "scale(0.9)" : "scale(1)",
        }}
      >
        {open ? (
          <X size={22} color="#38bdf8" />
        ) : (
          /* Custom NOVA logo — planet inside chat bubble */
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Chat bubble base */}
            <rect x="2" y="2" width="22" height="18" rx="5" fill="#0a0e1a" />
            {/* Bubble tail */}
            <path d="M8 20 L6 26 L14 20Z" fill="#0a0e1a" />
            {/* Planet */}
            <circle cx="13" cy="11" r="5.5" fill="#1e5fa8" />
            <path d="M9.5 8.5 Q11 6.5 13 7.5 Q15 6.5 16.5 8.5 Q17.5 10.5 16.5 13 Q15 15 13 15 Q11 15 9.5 13 Q8.5 10.5 9.5 8.5Z" fill="#1a4a8a" />
            <path d="M11 7.5 Q12.5 6 14 7.5 L14.5 9.5 Q13 11 11.5 9.5Z" fill="#2d8a4e" />
            <path d="M14.5 10 Q16.5 9.5 17 11.5 Q16.5 13 14.5 13 Q14 11.5 14.5 10Z" fill="#2d8a4e" />
            <path d="M9.5 11 Q10.5 10.5 11 12 Q10 13 9.5 12Z" fill="#2d8a4e" />
            {/* Atmosphere */}
            <circle cx="13" cy="11" r="5.5" fill="none" stroke="#38bdf8" strokeWidth="0.7" opacity="0.6" />
            {/* Orbit ring */}
            <ellipse cx="13" cy="11" rx="8.5" ry="3" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2.5 1.5" opacity="0.8" transform="rotate(-20 13 11)" />
            {/* Spacecraft */}
            <circle cx="20.5" cy="7" r="1.2" fill="#38bdf8" opacity="0.95" />
            {/* Stars */}
            <circle cx="4.5" cy="4.5" r="0.6" fill="#38bdf8" opacity="0.5" />
            <circle cx="23" cy="5" r="0.5" fill="#38bdf8" opacity="0.4" />
            <circle cx="4" cy="16" r="0.5" fill="#38bdf8" opacity="0.4" />
          </svg>
        )}
        {/* Pulse ring */}
        {!open && (
          <span
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              border: "2px solid #38bdf8",
              animation: "novaPulse 2s ease-out infinite",
              opacity: 0,
            }}
          />
        )}
      </button>

      <style>{`
        @keyframes novaPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes novaSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .nova-scrollbar::-webkit-scrollbar { width: 4px; }
        .nova-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .nova-scrollbar::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.25); border-radius: 4px; }
      `}</style>

      {/* ── Chat window ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "92px",
            right: "24px",
            zIndex: 9989,
            width: "min(380px, calc(100vw - 32px))",
            height: "min(540px, calc(100vh - 120px))",
            background: "linear-gradient(160deg, #0d1525 0%, #0a0e1a 100%)",
            border: "1px solid rgba(56,189,248,0.2)",
            borderRadius: "20px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(56,189,248,0.07)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "novaSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(14,165,233,0.15), rgba(56,189,248,0.08))",
              borderBottom: "1px solid rgba(56,189,248,0.15)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bot size={18} color="#0a0e1a" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: "'Chakra Petch', sans-serif", fontSize: 14, fontWeight: 700, color: "#f8fafc" }}>
                NOVA
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#38bdf8", display: "flex", alignItems: "center", gap: 4 }}>
                <Sparkles size={10} /> TERRANOVA Guide · Always online
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4 }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="nova-scrollbar"
            style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  gap: 8,
                  marginBottom: 12,
                  alignItems: "flex-end",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      msg.role === "bot"
                        ? "linear-gradient(135deg, #0ea5e9, #38bdf8)"
                        : "rgba(56,189,248,0.15)",
                    border: msg.role === "user" ? "1px solid rgba(56,189,248,0.3)" : "none",
                  }}
                >
                  {msg.role === "bot" ? (
                    <Bot size={14} color="#0a0e1a" />
                  ) : (
                    <User size={14} color="#38bdf8" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "9px 13px",
                    borderRadius:
                      msg.role === "user"
                        ? "16px 4px 16px 16px"
                        : "4px 16px 16px 16px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #0ea5e9, #0284c7)"
                        : "rgba(255,255,255,0.05)",
                    border:
                      msg.role === "bot"
                        ? "1px solid rgba(56,189,248,0.12)"
                        : "none",
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: msg.role === "user" ? "#f8fafc" : "#cbd5e1",
                  }}
                >
                  <BotText text={msg.text} />
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 10,
                      color: msg.role === "user" ? "rgba(248,250,252,0.6)" : "#475569",
                      textAlign: msg.role === "user" ? "right" : "left",
                    }}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 12 }}>
                <div
                  style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Bot size={14} color="#0a0e1a" />
                </div>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "4px 16px 16px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(56,189,248,0.12)",
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "#38bdf8", opacity: 0.7,
                        animation: `novaDot 1.2s ease-in-out ${d * 0.2}s infinite`,
                        display: "inline-block",
                      }}
                    />
                  ))}
                  <style>{`
                    @keyframes novaDot {
                      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                      40%           { transform: scale(1);   opacity: 1; }
                    }
                  `}</style>
                </div>
              </div>
            )}

            {/* Suggested questions */}
            {showSuggestions && messages.length === 1 && !typing && (
              <div style={{ marginTop: 4, marginBottom: 8 }}>
                <p style={{ margin: "0 0 8px", fontSize: 11, color: "#475569", fontFamily: "'Manrope', sans-serif" }}>
                  Try asking:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestion(q)}
                      style={{
                        background: "rgba(56,189,248,0.08)",
                        border: "1px solid rgba(56,189,248,0.25)",
                        borderRadius: 20,
                        padding: "5px 11px",
                        fontSize: 11,
                        color: "#7dd3fc",
                        cursor: "pointer",
                        fontFamily: "'Manrope', sans-serif",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.background = "rgba(56,189,248,0.18)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.background = "rgba(56,189,248,0.08)";
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              borderTop: "1px solid rgba(56,189,248,0.12)",
              padding: "10px 12px",
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexShrink: 0,
              background: "rgba(0,0,0,0.2)",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask NOVA anything…"
              disabled={typing}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(56,189,248,0.2)",
                borderRadius: 12,
                padding: "9px 13px",
                fontSize: 13,
                color: "#f1f5f9",
                fontFamily: "'Manrope', sans-serif",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(56,189,248,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(56,189,248,0.2)")}
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "none",
                background:
                  input.trim() && !typing
                    ? "linear-gradient(135deg, #0ea5e9, #38bdf8)"
                    : "rgba(56,189,248,0.1)",
                cursor: input.trim() && !typing ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              <Send size={15} color={input.trim() && !typing ? "#0a0e1a" : "#38bdf8"} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./FloatingChat.css";

const API = import.meta.env.VITE_API_URL;

const SUGGESTED = [
  "Which tea is best for sleep?",
  "Do you have green teas?",
  "How long does delivery take?",
  "Tell me about NEW10 coupon",
];

function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm TeaBot 🍵 — your personal tea guide. Ask me about any tea, our products, or your order!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDot, setShowDot] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setShowDot(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = { role: "user", text: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Build history (exclude the initial bot greeting from history sent to AI)
    const history = messages
      .filter(m => m.role === "user" || (m.role === "bot" && messages.indexOf(m) > 0))
      .map(m => ({ role: m.role === "user" ? "user" : "model", text: m.text }));

    try {
      const { data } = await axios.post(`${API}/api/chat`, { message: msg, history });
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Sorry, I'm having trouble right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="fc-root">
      {/* Chat window */}
      <div className={`fc-window${open ? " fc-window--open" : ""}`} role="dialog" aria-label="AI Chat Assistant">
        {/* Header */}
        <div className="fc-header">
          <div className="fc-header-info">
            <div className="fc-avatar">🍵</div>
            <div>
              <p className="fc-name">TeaBot</p>
              <p className="fc-status">
                <span className="fc-status-dot" />
                AI-powered · knows your catalog
              </p>
            </div>
          </div>
          <button className="fc-close" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
        </div>

        {/* Messages */}
        <div className="fc-messages">
          {messages.map((m, i) => (
            <div key={i} className={`fc-msg fc-msg--${m.role === "user" ? "user" : "bot"}`}>
              {m.role === "bot" && <span className="fc-msg-avatar">🍵</span>}
              <div className="fc-msg-bubble">{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="fc-msg fc-msg--bot">
              <span className="fc-msg-avatar">🍵</span>
              <div className="fc-msg-bubble fc-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions — show only at start */}
        {messages.length <= 1 && (
          <div className="fc-suggestions">
            {SUGGESTED.map(q => (
              <button key={q} className="fc-suggestion" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="fc-input-row">
          <textarea
            ref={inputRef}
            className="fc-input"
            placeholder="Ask about teas, orders, delivery…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button
            className="fc-send"
            onClick={() => send()}
            disabled={!input.trim() || loading}
            aria-label="Send"
          >
            ➤
          </button>
        </div>
      </div>

      {/* Trigger button */}
      <button
        className="fc-trigger"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
      >
        {open ? (
          <span className="fc-trigger-icon">✕</span>
        ) : (
          <>
            <span className="fc-trigger-icon">✨</span>
            {showDot && <span className="fc-trigger-dot" />}
          </>
        )}
      </button>
    </div>
  );
}

export default FloatingChat;

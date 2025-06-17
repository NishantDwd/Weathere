import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { askGeminiWeather } from "@/lib/geminiApi";

export default function WeatherChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me anything about weather, climate, or meteorology." }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const reply = await askGeminiWeather(userMsg);
      setMessages((msgs) => [...msgs, { from: "bot", text: reply }]);
    } catch {
      setMessages((msgs) => [...msgs, { from: "bot", text: "Sorry, I couldn't get a response." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Chat Bubble Button */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
          onClick={() => setOpen(true)}
          aria-label="Open weather chatbot"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[90vw] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-indigo-200 dark:border-indigo-800 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-100 dark:border-indigo-800 bg-indigo-500 rounded-t-2xl">
            <span className="font-bold text-white">Ask Weathere</span>
            <button
              className="text-white hover:text-yellow-300"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2" style={{ minHeight: 200, maxHeight: 320 }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                    msg.from === "user"
                      ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-900 dark:text-white"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-indigo-100 dark:border-indigo-800">
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              placeholder="Ask about weather..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition"
              disabled={loading || !input.trim()}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
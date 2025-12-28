import { useState, useEffect, useRef } from "react";

// ChatMessage Component
function ChatMessage({ role, text }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
      <div className="flex items-end gap-2 max-w-[80%]">
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0 mb-1">
            <svg className="w-4 h-4 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        )}
        
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${isUser
              ? "bg-black dark:bg-white text-white dark:text-black rounded-br-md"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-700"
            }`}
        >
          {text}
        </div>

        {isUser && (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mb-1">
            <svg className="w-4 h-4 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// ChatbotWindow Component
function ChatbotWindow({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi there! 👋 I'm your store assistant. I can help you with orders, delivery tracking, and product recommendations."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastIntent, setLastIntent] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, lastIntent })
      });

      const data = await res.json();

      if (data.intent) {
        setLastIntent(data.intent);
      } else {
        setLastIntent(null);
      }

      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text: data.reply,
          products: data.products || null
        }
      ]);

    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "⚠️ I'm having trouble connecting. Please try again in a moment." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[600px] max-h-[80vh]
      bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
      border-2 border-black dark:border-white flex flex-col overflow-hidden
      animate-slideUp">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-black dark:bg-white border-b-2 border-black dark:border-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
            <svg className="w-5 h-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-base text-white dark:text-black">Store Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-xs text-gray-300 dark:text-gray-700">Online</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="w-8 h-8 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition flex items-center justify-center"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-950">
        {messages.map((msg, i) => (
          <div key={i}>
            <ChatMessage role={msg.role} text={msg.text} />

            {/* Product cards */}
            {msg.products && (
              <div className="mt-3 grid grid-cols-2 gap-3 animate-fadeIn">
                {msg.products.map(product => (
                  <a
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-200 group"
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-24 w-full object-cover group-hover:opacity-90 transition"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold line-clamp-2 text-gray-900 dark:text-gray-100 mb-1">
                        {product.title}
                      </p>
                      <p className="text-black dark:text-white font-bold text-sm">
                        ₹{product.price}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md border border-gray-200 dark:border-gray-700">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t-2 border-black dark:border-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-white text-sm
              focus:outline-none focus:border-black dark:focus:border-white
              placeholder-gray-400 dark:placeholder-gray-500
              transition"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-black dark:bg-white
              text-white dark:text-black font-bold text-sm
              hover:bg-gray-800 dark:hover:bg-gray-100
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ChatbotWidget Component
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full
                   bg-black dark:bg-white
                   text-white dark:text-black flex items-center justify-center shadow-lg
                   hover:scale-105 active:scale-95 transition-all duration-200`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        
        {/* Notification badge */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 border-2 border-white dark:border-black rounded-full text-xs font-bold flex items-center justify-center text-white">
            1
          </span>
        )}
      </button>

      {/* Chat Window */}
      {open && <ChatbotWindow onClose={() => setOpen(false)} />}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
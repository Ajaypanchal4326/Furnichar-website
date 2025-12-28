import { useState } from "react";
import ChatbotWindow from "./ChatbotWindow";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full 
                   bg-black dark:bg-white text-white dark:text-black 
                   flex items-center justify-center shadow-lg
                   hover:scale-105 active:scale-95 transition-all"
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
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 
                         border-2 border-white dark:border-black rounded-full 
                         text-xs font-bold flex items-center justify-center text-white">
            1
          </span>
        )}
      </button>

      {/* Chat Window */}
      {open && <ChatbotWindow onClose={() => setOpen(false)} />}
    </>
  );
}
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const TOAST_DURATION = 3000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, TOAST_DURATION);
  }, [removeToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-3 w-[min(92vw,360px)]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-fadeIn ${
              toast.type === "success"
                ? "bg-emerald-50/95 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100"
                : toast.type === "error"
                ? "bg-red-50/95 dark:bg-red-900/40 border-red-200 dark:border-red-700 text-red-900 dark:text-red-100"
                : "bg-gray-50/95 dark:bg-gray-900/90 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            }`}
            role="status"
            aria-live="polite"
          >
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-xs px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Dismiss notification"
            >
              Close
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}


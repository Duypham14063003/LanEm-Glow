"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              animate-fade-in px-4 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap
              ${t.type === "success" ? "bg-[var(--color-primary-strong)] text-white" : ""}
              ${t.type === "error" ? "bg-[var(--color-danger)] text-white" : ""}
              ${t.type === "info" ? "bg-white text-[var(--color-foreground)] border border-[var(--color-border)]" : ""}
            `}
          >
            {t.type === "success" && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

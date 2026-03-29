"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error";

interface ToastItem {
  id: string;
  title: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (title: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((title: string, tone: ToastTone = "success") => {
    const id = crypto.randomUUID();

    setToasts((current) => [...current, { id, title, tone }]);

    window.setTimeout(() => {
      dismiss(id);
    }, 3500);
  }, [dismiss]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-card border px-4 py-3 shadow-2xl backdrop-blur-xl",
              toast.tone === "success"
                ? "border-status-success/20 bg-bg-surface text-status-success"
                : "border-status-error/20 bg-bg-surface text-status-error"
            )}
          >
            {toast.tone === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <p className="flex-1 text-sm font-medium">{toast.title}</p>
            <button
              className="text-current/80 transition hover:text-current"
              onClick={() => dismiss(toast.id)}
              type="button"
            >
              <X className="h-4 w-4" />
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

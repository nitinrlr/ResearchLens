"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Toast } from "radix-ui";
import { CircleAlert, X } from "lucide-react";
import { IconButton } from "@radix-ui/themes";

type ToastItem = {
  id: number;
  message: string;
};

type ToastApi = {
  showError: (message: string) => void;
};

/** Most toasts kept on screen at once. Older ones are dropped. */
const MAX_TOASTS = 3;

const ToastContext = createContext<ToastApi | null>(null);

/*
  Radix's Toast handles the parts that are easy to get wrong: screen readers
  announce each message, the timer pauses while you hover or focus a toast,
  F8 jumps to them from the keyboard, and they can be swiped away.
*/
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(0);

  const showError = useCallback((message: string) => {
    const id = ++nextIdRef.current;

    setToasts((current) => [
      ...current.slice(-(MAX_TOASTS - 1)),
      { id, message },
    ]);
  }, []);

  const api = useMemo(() => ({ showError }), [showError]);

  function dismiss(id: number) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext value={api}>
      <Toast.Provider
        duration={6000}
        swipeDirection="right"
      >
        {children}

        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            type="foreground"
            onOpenChange={(open) => {
              if (!open) {
                dismiss(toast.id);
              }
            }}
            className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4 text-ink shadow-lg data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)"
          >
            <CircleAlert
              size={18}
              className="mt-0.5 shrink-0 text-danger"
              aria-hidden
            />

            <Toast.Description className="min-w-0 flex-1 text-sm">
              {toast.message}
            </Toast.Description>

            <Toast.Close asChild>
              <IconButton
                variant="ghost"
                color="gray"
                size="1"
                aria-label="Dismiss"
              >
                <X size={16} />
              </IconButton>
            </Toast.Close>
          </Toast.Root>
        ))}

        <Toast.Viewport className="fixed bottom-0 right-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4 outline-none" />
      </Toast.Provider>
    </ToastContext>
  );
}

/** Shows a message in the corner of the screen. Use inside <ToastProvider>. */
export function useToast() {
  const api = useContext(ToastContext);

  if (!api) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }

  return api;
}

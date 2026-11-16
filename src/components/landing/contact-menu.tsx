"use client";

import { useState, useTransition } from "react";
import { Popover } from "radix-ui";
import { CircleCheck, Mail, X } from "lucide-react";

import { sendContactMessageAction } from "@/actions/contact";
import { MAX_EMAIL_LENGTH, MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH } from "@/lib/contact-form";
import { runAction } from "@/lib/run-action";

const FIELD =
  "w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/15 outline-none transition placeholder:text-mist/50 focus:ring-2 focus:ring-sky";

/**
 * The landing nav's Contact button. It drops down a small form for a name,
 * email and optional message, saved to the ContactMessage table.
 */
export default function ContactMenu() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onOpenChange(next: boolean) {
    setOpen(next);
    // Reopening after sending starts a fresh form.
    if (next) {
      setSent(false);
      setError(null);
    }
  }

  // onSubmit rather than <form action>, so a failed send keeps what was typed.
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const message = await runAction(sendContactMessageAction, formData);
      setError(message);
      if (!message) setSent(true);
    });
  }

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger className="flex items-center gap-1.5 rounded-full px-2 py-2 text-sm transition hover:text-sky data-[state=open]:text-sky sm:px-3.5">
        <Mail size={16} className="sm:hidden" aria-hidden="true" />
        <span className="max-sm:sr-only">Contact</span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={12}
          collisionPadding={12}
          className="contact-pop z-50 w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl bg-night/95 p-5 text-white shadow-[0_24px_60px_-20px_rgb(3_8_30/0.9),inset_0_0_0_1px_rgb(255_255_255/0.12)] backdrop-blur-xl"
        >
          <Popover.Close
            aria-label="Close"
            className="absolute right-3 top-3 rounded-full p-1.5 text-mist transition hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </Popover.Close>

          {sent ? (
            <div role="status" className="flex flex-col items-center gap-2 py-4 text-center">
              <CircleCheck size={28} className="text-sky" aria-hidden="true" />
              <p className="font-display text-lg font-bold">Thanks for reaching out</p>
              <p className="text-sm text-mist">We&apos;ll get back to you by email.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3">
              <div>
                <p className="font-display text-lg font-bold tracking-tight">Get in touch</p>
                <p className="mt-0.5 text-sm text-mist">Questions, ideas or feedback. We read everything.</p>
              </div>

              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Name
                <input name="name" required maxLength={MAX_NAME_LENGTH} autoComplete="name" className={FIELD} />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={MAX_EMAIL_LENGTH}
                  autoComplete="email"
                  className={FIELD}
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-medium">
                <span>
                  Message <span className="font-normal text-mist">(optional)</span>
                </span>
                <textarea name="message" rows={3} maxLength={MAX_MESSAGE_LENGTH} className={`${FIELD} resize-none`} />
              </label>

              {/* Hidden from people; bots fill it in. See isLikelyBot(). */}
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              {error && (
                <p role="alert" className="text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="mt-1 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-night transition hover:bg-mist disabled:opacity-60"
              >
                {pending ? "Sending…" : "Send"}
              </button>
            </form>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

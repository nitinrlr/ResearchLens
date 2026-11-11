"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Button, IconButton, Text, TextArea } from "@radix-ui/themes";

import { ASK_AI_EVENT } from "@/components/ask-ai-selection";
import RevealText from "@/components/reveal-text";
import { CHAT_STARTERS } from "@/lib/chat-starters";
import type { ChatStarter } from "@/lib/chat-starters";

type Message = {
  role: "user" | "assistant";
  text: string;
  quote?: string;
  error?: boolean;
};

type StreamLine =
  | { type: "start"; source: "pdf" | "abstract"; paperUnavailable: boolean }
  | { type: "text"; text: string }
  | { type: "done"; interactionId: string | null }
  | { type: "error"; message: string };

/**
 * The AI chat beside a paper. Conversations live only in the page for now,
 * so they reset when the reader leaves.
 */
export default function PaperChat({ paperId }: { paperId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [quote, setQuote] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  // On phones the chat opens as a full-screen panel.
  const [open, setOpen] = useState(false);
  // On wide screens it can fold up to just its heading.
  const [collapsed, setCollapsed] = useState(false);

  const conversation = useRef({ previousId: null as string | null, paperAttached: false, paperUnavailable: false });
  const scroller = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function onAskAi(event: Event) {
      setQuote((event as CustomEvent<string>).detail);
      setOpen(true);
      setCollapsed(false);
      textarea.current?.focus();
    }

    window.addEventListener(ASK_AI_EVENT, onAskAi);
    return () => window.removeEventListener(ASK_AI_EVENT, onAskAi);
  }, []);

  // A new message always scrolls into view.
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages.length]);

  // While an answer appears, follow it only if the reader is already at the
  // bottom, so scrolling up to reread isn't interrupted.
  const followAnswer = useCallback(() => {
    const element = scroller.current;
    if (element && element.scrollHeight - element.scrollTop - element.clientHeight < 80) {
      element.scrollTo({ top: element.scrollHeight });
    }
  }, []);

  function updateLast(change: (message: Message) => Message) {
    setMessages((current) => [...current.slice(0, -1), change(current.at(-1)!)]);
  }

  async function send(text: string, starter?: ChatStarter) {
    if (pending) return;

    const sentQuote = quote;
    setMessages((current) => [
      ...current,
      { role: "user", text: starter ? CHAT_STARTERS[starter].label : text, quote: sentQuote ?? undefined },
      { role: "assistant", text: "" },
    ]);
    setInput("");
    setQuote(null);
    setPending(true);

    try {
      const response = await fetch(`/api/papers/${paperId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, quote: sentQuote, starter, ...conversation.current }),
      });

      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "The chat couldn't be reached. Please try again.");
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const raw of lines.filter(Boolean)) {
          const line = JSON.parse(raw) as StreamLine;

          if (line.type === "start") {
            if (line.source === "pdf") conversation.current.paperAttached = true;
            if (line.paperUnavailable) conversation.current.paperUnavailable = true;
          } else if (line.type === "text") {
            updateLast((message) => ({ ...message, text: message.text + line.text }));
          } else if (line.type === "done") {
            if (line.interactionId) conversation.current.previousId = line.interactionId;
          } else {
            throw new Error(line.message);
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      updateLast((last) => ({ ...last, text: last.text || message, error: !last.text }));
    } finally {
      setPending(false);
    }
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (input.trim() || quote) send(input.trim());
  }

  return (
    <>
      <Button
        size="3"
        onClick={() => setOpen(true)}
        className={`fixed bottom-4 right-4 z-30 shadow-lg lg:hidden ${open ? "hidden" : ""}`}
      >
        <MessageCircle size={18} />
        Ask AI
      </Button>

      <aside
        aria-label="Ask Lens"
        className={`glass-panel flex flex-col gap-3 max-lg:fixed max-lg:inset-3 max-lg:z-40 lg:sticky lg:top-3 lg:overflow-hidden lg:transition-[height] lg:duration-300 lg:ease-out motion-reduce:transition-none ${
          // 5.5rem fits the heading row and the panel's padding.
          collapsed ? "lg:h-[5.5rem]" : "lg:h-[calc(100svh-1.5rem)]"
        } ${open ? "" : "max-lg:hidden"}`}
      >
        <div className="flex items-center justify-between gap-2">
          <Text as="p" weight="medium" className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            Questions? Ask Lens!
          </Text>
          <IconButton
            variant="ghost"
            color="gray"
            aria-label={collapsed ? "Show chat" : "Hide chat"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
            className="max-lg:hidden"
          >
            {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </IconButton>
          <IconButton variant="ghost" color="gray" aria-label="Close chat" onClick={() => setOpen(false)} className="lg:hidden">
            <X size={18} />
          </IconButton>
        </div>

        {/* Fades out while the panel folds up; inert keeps its buttons out of reach. */}
        <div
          inert={collapsed}
          className={`flex min-h-0 flex-1 flex-col gap-3 transition-opacity duration-200 motion-reduce:transition-none ${
            collapsed ? "lg:opacity-0" : ""
          }`}
        >
          <div ref={scroller} aria-live="polite" className="-mx-1 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-1">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-2">
                <Text size="2" color="gray">
                  Ask anything about this paper, or highlight text in the abstract or PDF and choose Ask Lens.
                </Text>
                {(Object.keys(CHAT_STARTERS) as ChatStarter[]).map((starter) => (
                  <Button key={starter} variant="soft" color="gray" className="justify-start" onClick={() => send("", starter)}>
                    {CHAT_STARTERS[starter].label}
                  </Button>
                ))}
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.role === "user"
                      ? "ml-6 self-end rounded-xl bg-accent px-3 py-2 text-sm text-white"
                      : `mr-2 whitespace-pre-wrap text-sm leading-relaxed ${message.error ? "text-danger" : "text-ink"}`
                  }
                >
                  {message.quote && (
                    <p className="mb-1.5 line-clamp-3 border-l-2 border-white/60 pl-2 italic opacity-90">{message.quote}</p>
                  )}
                  {message.role === "user" ? (
                    message.text
                  ) : message.text ? (
                    <RevealText text={message.text.replaceAll("**", "")} onGrow={followAnswer} />
                  ) : (
                    pending && index === messages.length - 1 && <span className="animate-pulse text-ink-muted">Reading the paper…</span>
                  )}
                </div>
              ))
            )}
          </div>

          {conversation.current.paperUnavailable && (
            <Text size="1" color="gray">
              This paper&apos;s PDF couldn&apos;t be read (the publisher may block it, or it&apos;s very long), so answers come from the abstract.
            </Text>
          )}

          <form onSubmit={submit} className="flex flex-col gap-2">
            {quote && (
              <div className="flex items-start gap-2 rounded-lg bg-white/10 p-2 text-xs">
                <p className="line-clamp-3 flex-1 italic">{quote}</p>
                <IconButton type="button" size="1" variant="ghost" color="gray" aria-label="Remove quote" onClick={() => setQuote(null)}>
                  <X size={14} />
                </IconButton>
              </div>
            )}

            {/* Stretch keeps the send button the same height as the question box. */}
            <div className="flex items-stretch gap-2">
              <TextArea
                ref={textarea}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) submit(event);
                }}
                placeholder={quote ? "Ask about this passage…" : "Ask a question…"}
                aria-label="Your question"
                maxLength={2000}
                rows={2}
                className="flex-1"
              />
              <IconButton type="submit" size="3" aria-label="Send" loading={pending} disabled={!input.trim() && !quote} className="h-auto">
                <Send size={18} />
              </IconButton>
            </div>
          </form>
        </div>
      </aside>
    </>
  );
}

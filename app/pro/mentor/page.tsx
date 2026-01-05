"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ChatMsg = { role: "user" | "assistant"; text: string };

export default function ProMentorPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      text: "Tell me what you’re building — product, audience, and your current bottleneck.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // "started" = user has sent the first message -> switch UI to ChatGPT layout
  const [started, setStarted] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const chips = useMemo(
    () => ["Pricing", "Positioning", "Launch plan", "Content", "Manufacturing"],
    []
  );

  useEffect(() => {
    if (!started) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, started]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    if (!started) setStarted(true);

    setInput("");
    setLoading(true);

    // capture history BEFORE we add the new user message (basic context)
    const history = messages.slice(-20);

    // optimistic UI: add user message immediately
    setMessages((m) => [...m, { role: "user", text }]);

    try {
      const res = await fetch("/api/pro-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      const data = await res.json();

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: data?.answer ?? "No answer returned.",
        },
      ]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: `Server error: ${e?.message ?? "unknown error"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function resetChat() {
    setStarted(false);
    setInput("");
    setLoading(false);
    setMessages([
      {
        role: "assistant",
        text: "Tell me what you’re building — product, audience, and your current bottleneck.",
      },
    ]);
  }

  // ----------------------------
  // UI: HERO MODE (first load)
  // ----------------------------
  if (!started) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
              AI Fashion Mentor
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Ask your mentor.
              <br />
              Get a plan you can execute.
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Strategy + steps + numbers. No fluff.
            </p>
          </div>

          {/* Hero Composer */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={3}
              placeholder="Type your question… (Enter to send, Shift+Enter for newline)"
              className="w-full resize-none rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/25"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      setInput((v) =>
                        v ? v : `Help me with ${c.toLowerCase()} for my fashion brand.`
                      )
                    }
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
                  >
                    {c}
                  </button>
                ))}
              </div>

              <button
                onClick={send}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-60"
              >
                {loading ? "…" : "Send"}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-white/35">
            After your first message, the page switches to a full chat layout.
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------
  // UI: CHAT MODE (ChatGPT-style)
  // ----------------------------
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            <div className="text-sm font-semibold">AI Fashion Mentor</div>
          </div>

          <button
            onClick={resetChat}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"
          >
            New chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="mx-auto max-w-4xl px-4">
        <div
          ref={scrollRef}
          className="h-[calc(100vh-140px)] overflow-y-auto py-6"
        >
          <div className="space-y-4">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} text={m.text} />
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                  Thinking…
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Composer fixed at bottom */}
      <div className="sticky bottom-0 border-t border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              placeholder="Message AI Fashion Mentor…"
              className="flex-1 resize-none rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/25"
            />

            <button
              onClick={send}
              disabled={loading}
              className="inline-flex h-[44px] items-center justify-center rounded-2xl bg-white px-4 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-60"
            >
              Send
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() =>
                  setInput((v) =>
                    v ? v : `Help me with ${c.toLowerCase()} for my fashion brand.`
                  )
                }
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  text,
}: {
  role: "user" | "assistant";
  text: string;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-white text-black"
            : "border border-white/10 bg-white/5 text-white"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

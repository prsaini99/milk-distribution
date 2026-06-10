"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Send } from "lucide-react";
import type { Insight, InsightDetail } from "@/server/services/analytics.service";

/**
 * "Ask your data" — an AI-style analytics assistant for the admin. The
 * question understanding is mocked (predefined questions + light keyword
 * routing), but the answers are computed from live data on the server and
 * passed in. Swap the matcher for OpenAI/Gemini later; answers stay the same.
 */

type Msg = { from: "bot" | "user"; text: string; details?: InsightDetail[] };

// Keywords that route free-typed text to a predefined insight.
const KEYWORDS: Record<string, string[]> = {
  "top-product": ["best", "selling", "seller", "popular", "top product"],
  revenue: ["revenue", "sales", "earn", "money", "made", "income"],
  "best-customer": ["customer", "buyer", "client", "who"],
  aov: ["average", "aov", "order value", "basket"],
  status: ["status", "pending", "delivered", "split", "fulfil"],
  stock: ["stock", "inventory", "out of stock", "restock"],
  subscriptions: ["subscription", "subscriptions", "recurring", "subscribe"],
};

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        from: "bot",
        text: "Hi! I'm your business analyst 📊 Ask about sales, revenue, customers, stock or subscriptions — or tap a question below.",
      },
    ]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  function answer(insight: Insight) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { from: "bot", text: insight.answer, details: insight.details },
      ]);
    }, 600);
  }

  function ask(insight: Insight) {
    setMessages((m) => [...m, { from: "user", text: insight.question }]);
    answer(insight);
  }

  function onSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text }]);

    const t = text.toLowerCase();
    const match = insights.find((i) =>
      KEYWORDS[i.id]?.some((k) => t.includes(k)),
    );
    if (match) {
      answer(match);
    } else {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            from: "bot",
            text: "I can answer questions about sales, revenue, customers, stock and subscriptions. Try one of the suggestions below.",
          },
        ]);
      }, 600);
    }
  }

  return (
    <div className="surface-card flex h-[34rem] max-h-[70vh] flex-col overflow-hidden p-0">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-primary px-4 py-3 text-primary-foreground">
        <span className="flex size-8 items-center justify-center rounded-full bg-white/15">
          <Sparkles className="size-4" />
        </span>
        <div className="leading-none">
          <p className="text-sm font-bold">Ask your data</p>
          <p className="mt-0.5 text-[0.7rem] text-primary-foreground/80">
            AI business analyst · live figures
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.from === "user" ? "flex justify-end" : "flex"}
          >
            <div
              className={
                "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm " +
                (m.from === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground")
              }
            >
              {m.text}
              {m.details && m.details.length > 0 && (
                <div className="mt-2 space-y-1 border-t border-border/60 pt-2">
                  {m.details.map((d, j) => (
                    <div key={j} className="flex justify-between gap-4 text-xs">
                      <span className="text-muted-foreground">{d.label}</span>
                      <span className="font-medium">{d.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex">
            <div className="flex gap-1 rounded-2xl bg-secondary px-3.5 py-3">
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      <div className="flex flex-wrap gap-2 border-t border-border/60 px-4 py-3">
        {insights.map((i) => (
          <button
            key={i.id}
            onClick={() => ask(i)}
            className="rounded-full border border-primary/30 bg-card px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/10"
          >
            {i.question}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-border/60 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask a question…"
          className="field-control py-2 pl-3 pr-3 text-sm"
        />
        <button
          onClick={onSend}
          aria-label="Send"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary/90"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
}

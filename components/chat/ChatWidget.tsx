"use client";

import { MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, Dialog } from "@/components/ui";
import { ChatMessage } from "./ChatMessage";

type Turn = { role: "user" | "model"; text: string };

const SUGGESTIONS = [
  "Which speaker suits a small room?",
  "How does swapping work?",
  "What's available right now?",
];
const MAX_CHARS = 1000;
const MAX_TURNS = 20; // matches /api/chat

/** "Ask about a speaker": a Gemini-backed chat in a sheet (bottom sheet on phones). */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep the newest message in view as text streams in
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [turns]);

  async function ask(question: string) {
    const text = question.trim();
    if (!text || busy) return;
    const history = [...turns, { role: "user" as const, text }].slice(-MAX_TURNS);
    setTurns([...history, { role: "model", text: "" }]);
    setDraft("");
    setError(undefined);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const { error: message } = await res.json().catch(() => ({ error: undefined }));
        throw new Error(message ?? "The assistant couldn't answer just now.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setTurns([...history, { role: "model", text: answer }]);
      }
      if (!answer.trim()) throw new Error("The assistant couldn't answer just now.");
    } catch (e) {
      setTurns(history.slice(0, -1)); // drop the unanswered question…
      setDraft(text); // …but keep its text in the box to try again
      setError(`${e instanceof Error ? e.message : "Something went wrong."} Try again.`);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      <button
        type="button"
        className="ha-chat-launcher"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Ask about a speaker"
      >
        <MessageCircle size={22} aria-hidden="true" />
        {/* Label shows from 768px; on phones the round icon keeps the footer clear */}
        <span className="ha-chat-launcher__label" aria-hidden="true">
          Ask about a speaker
        </span>
      </button>

      <Dialog sheet open={open} title="Ask Hearth Audio" onClose={() => setOpen(false)} width={520}>
        <div className="ha-chat">
          <div ref={listRef} className="ha-chat__log" role="log" aria-live="polite" aria-busy={busy}>
            {turns.length === 0 ? (
              <div className="ha-chat__intro">
                <p>Ask about any speaker, how renting works, or delivery in Nairobi.</p>
                <div className="ha-chat__suggestions">
                  {SUGGESTIONS.map((s) => (
                    <Button key={s} variant="secondary" size="sm" onClick={() => ask(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              turns.map((t, i) => (
                <ChatMessage
                  key={i}
                  role={t.role}
                  text={t.text}
                  pending={busy && i === turns.length - 1}
                  onNavigate={() => setOpen(false)}
                />
              ))
            )}
          </div>

          {error && (
            <p role="alert" className="ha-field__error">
              {error}
            </p>
          )}

          <form
            className="ha-chat__form"
            onSubmit={(e) => {
              e.preventDefault();
              ask(draft);
            }}
          >
            <label htmlFor="chat-input" className="ha-visually-hidden">
              Your question
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              className="ha-input ha-chat__input"
              rows={2}
              maxLength={MAX_CHARS}
              placeholder="Ask a question"
              value={draft}
              onChange={(e) => setDraft(e.currentTarget.value)}
              onKeyDown={(e) => {
                // Enter sends; Shift+Enter adds a line
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask(draft);
                }
              }}
            />
            <Button type="submit" iconStart={Send} disabled={busy || !draft.trim()} aria-label="Send question">
              {busy ? "Sending" : "Send"}
            </Button>
          </form>
          <p className="ha-small ha-chat__note">
            Answers come from an AI assistant and can be wrong. It can&apos;t book or change rentals.
          </p>
        </div>
      </Dialog>
    </>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

const SPEAKER_PATH = /(\/speakers\/[a-z0-9-]+)/g;

/** Plain text (never HTML), with /speakers/<id> paths turned into links. */
function withLinks(text: string, onNavigate?: () => void): ReactNode[] {
  return text.split(SPEAKER_PATH).map((part, i) =>
    i % 2 === 1 ? (
      <Link key={i} href={part} onClick={onNavigate}>
        {part}
      </Link>
    ) : (
      part
    ),
  );
}

/** One chat bubble. The assistant's text arrives in pieces while it streams. */
export function ChatMessage({
  role,
  text,
  pending = false,
  onNavigate,
}: {
  role: "user" | "model";
  text: string;
  pending?: boolean;
  /** Called when a speaker link is followed, e.g. to close the chat panel */
  onNavigate?: () => void;
}) {
  return (
    <div className={`ha-chat-msg ha-chat-msg--${role}`}>
      <span className="ha-visually-hidden">{role === "user" ? "You said:" : "Hearth Audio said:"}</span>
      <p className="ha-chat-msg__text">
        {text ? withLinks(text, onNavigate) : pending ? <span className="ha-chat-msg__typing">Thinking…</span> : null}
      </p>
    </div>
  );
}

import { GoogleGenAI } from "@google/genai";
import { systemInstruction } from "@/lib/chat/context";

// Chat assistant endpoint. The Gemini key stays on the server (GEMINI_API_KEY);
// the browser only sends the conversation and receives streamed plain text.

// Tried in order. Google retires models for new keys (404) and newer ones are often
// overloaded (503), so fall back instead of failing. GEMINI_MODEL overrides the first.
// Checked 24 Oct 2026: gemini-2.5-flash is gone for new keys; 3.7/3.8-flash were overloaded.
const MODELS = [process.env.GEMINI_MODEL || "gemini-3.5-flash", "gemini-3.1-flash-lite"];
const RETRYABLE = new Set([404, 429, 500, 503]);
const MAX_TURNS = 20;
const MAX_CHARS = 1000;

type Turn = { role: "user" | "model"; text: string };

function parse(body: unknown): Turn[] | null {
  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_TURNS) return null;
  const turns: Turn[] = [];
  for (const m of messages) {
    const { role, text } = (m ?? {}) as Partial<Turn>;
    if ((role !== "user" && role !== "model") || typeof text !== "string") return null;
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_CHARS) return null;
    turns.push({ role, text: trimmed });
  }
  return turns.at(-1)!.role === "user" ? turns : null;
}

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return Response.json({ error: "The assistant isn't set up yet." }, { status: 503 });

  // Only this site may call the endpoint from a browser (it spends the API quota)
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return Response.json({ error: "Not allowed." }, { status: 403 });
  }

  const turns = parse(await request.json().catch(() => null));
  if (!turns) return Response.json({ error: "Send a question under 1,000 characters." }, { status: 400 });

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const request = {
      contents: turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
      config: {
        systemInstruction: await systemInstruction(),
        maxOutputTokens: 600,
        temperature: 0.4,
        // Short factual answers. Thinking would spend the token budget before any text
        // (answers came back cut off in testing) and delay the first words.
        thinkingConfig: { thinkingBudget: 0 },
      },
    };

    let stream: Awaited<ReturnType<typeof ai.models.generateContentStream>> | undefined;
    for (const model of MODELS) {
      try {
        stream = await ai.models.generateContentStream({ model, ...request });
        break;
      } catch (error) {
        const status = (error as { status?: number }).status;
        if (!status || !RETRYABLE.has(status) || model === MODELS.at(-1)) throw error;
        console.warn(`chat: ${model} returned ${status}, trying the next model`);
      }
    }
    if (!stream) throw new Error("No model answered");

    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
          }
        } catch (error) {
          console.error("chat stream", error);
          controller.enqueue(encoder.encode("\n\nThe answer was cut off. Ask again, or call us."));
        } finally {
          controller.close();
        }
      },
    });
    return new Response(body, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("chat", error);
    return Response.json({ error: "The assistant couldn't answer just now." }, { status: 502 });
  }
}

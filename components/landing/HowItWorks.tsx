const STEPS = [
  { title: "Choose a speaker.", body: "Read notes from people who heard it at home." },
  { title: "Listen for a month.", body: "We deliver anywhere in Nairobi." },
  { title: "Swap or return.", body: "Write a listening note, then pick your next sound." },
] as const;

/** Three steps between the landing hero and the speaker list. */
export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="ha-how">
      <h2 id="how-heading" className="ha-label ha-how__heading">
        How it works
      </h2>
      <ol className="ha-how__steps">
        {STEPS.map((s, i) => (
          <li key={s.title} className="ha-how__step">
            <span className="ha-how__num ha-num" aria-hidden="true">
              {i + 1}
            </span>
            <p>
              <strong className="ha-how__title">{s.title}</strong> {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

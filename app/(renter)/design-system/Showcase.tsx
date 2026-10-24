"use client";

import { ArrowRight, Heart } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  FilterTag,
  IconButton,
  ListeningNote,
  Logo,
  Radio,
  Select,
  SpeakerCard,
  StarRating,
  StatusChip,
  Switch,
  Tabs,
  TextField,
  Toast,
  Tooltip,
} from "@/components/ui";
import { sampleSpeakers } from "@/lib/sample-speakers";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "grid", gap: 20, paddingTop: 48 }}>
      <h2>{title}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>{children}</div>
    </section>
  );
}

export function Showcase() {
  const [stars, setStars] = useState(0);
  const [available, setAvailable] = useState(true);
  const [tab, setTab] = useState<"notes" | "details">("notes");
  const [dialog, setDialog] = useState(false);

  return (
    <>
      <Section title="Logo">
        <Logo variant="icon-graphite" size={48} />
        <Logo variant="icon-ivory" size={48} />
        <Logo variant="symbol-on-light" size={48} />
        <span style={{ background: "var(--color-graphite)", padding: 8, borderRadius: 8, display: "inline-flex" }}>
          <Logo variant="symbol-on-dark" size={48} />
        </span>
        <Logo withName />
      </Section>

      <Section title="Buttons">
        <Button>Rent for a month</Button>
        <Button variant="secondary">Read listening notes</Button>
        <Button variant="ghost" iconEnd={ArrowRight}>
          Swap
        </Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Unavailable until 3 Nov</Button>
        <IconButton icon={Heart} label="Save" outline />
        <span style={{ background: "var(--color-graphite)", padding: 12, borderRadius: 8 }}>
          <Button variant="inverse">Inverse</Button>
        </span>
      </Section>

      <Section title="Status and feedback">
        <StatusChip status="available" />
        <StatusChip status="due">Returns 3 Nov</StatusChip>
        <StatusChip status="overdue" />
        <StatusChip status="rented" />
        <Tooltip content="Returns Sun 8 Nov">
          <Button variant="secondary" size="sm">Hover for tooltip</Button>
        </Tooltip>
        <Toast tone="success">Booked. We&apos;ll message you to arrange delivery.</Toast>
        <Toast tone="error" onClose={() => {}}>Your note wasn&apos;t saved. Your text is still here. Try again.</Toast>
        <Button variant="secondary" onClick={() => setDialog(true)}>
          Open dialog
        </Button>
        <Dialog
          open={dialog}
          title="Confirm booking"
          onClose={() => setDialog(false)}
          actions={
            <>
              <Button variant="ghost" onClick={() => setDialog(false)}>Cancel</Button>
              <Button onClick={() => setDialog(false)}>Confirm booking</Button>
            </>
          }
        >
          Ember Monitor, 30 days, from Sat 24 Oct to Mon 23 Nov. KES 18,000.
        </Dialog>
      </Section>

      <Section title="Forms">
        <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 420 }}>
          <TextField label="Email" type="email" placeholder="you@example.com" />
          <TextField label="Password" type="password" error="That email or password isn't right. Try again." />
          <TextField
            label="Your listening note"
            multiline
            hint="What did you play, and how did it sound in your room?"
          />
          <Select label="Start date" options={["Sat 24 Oct 2026", "Sun 25 Oct 2026", "Mon 26 Oct 2026"]} />
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <StarRating value={stars} onChange={setStars} size={20} />
            <span className="ha-small">{stars ? `${stars} of 5` : "Choose a star rating."}</span>
          </div>
          <Switch label="Available now" checked={available} onChange={setAvailable} />
          <Checkbox label="Remember me" defaultChecked />
          <div style={{ display: "flex", gap: 20 }}>
            <Radio name="room" label="Small room" defaultChecked />
            <Radio name="room" label="Large room" />
          </div>
        </div>
      </Section>

      <Section title="Navigation">
        <FilterTag selected={available} onClick={() => setAvailable(!available)}>
          Available now
        </FilterTag>
        <div style={{ width: "100%" }}>
          <Tabs
            label="Speaker sections"
            items={[{ value: "notes", label: "Listening notes" }, { value: "details", label: "Details" }]}
            value={tab}
            onChange={setTab}
          />
        </div>
      </Section>

      <Section title="Content">
        <Card style={{ maxWidth: 420 }}>
          <h3>Card</h3>
          <p className="ha-small" style={{ color: "var(--text-muted)", marginTop: 8 }}>
            White surface, hairline border, no resting shadow.
          </p>
        </Card>
        <div style={{ width: "100%", maxWidth: 640 }}>
          <ListeningNote stars={5} author="Wanjiru" area="Kilimani" date="12 Oct 2026">
            Played Sunday jazz and a lot of afrobeats. Vocals sit forward and nothing is harsh, even at night volume.
          </ListeningNote>
        </div>
      </Section>

      <div className="ha-grid">
        {sampleSpeakers.map((s) => (
          <SpeakerCard
            key={s.id}
            href={`/speakers/${s.id}`}
            brand={s.summary}
            name={s.name}
            price={s.price}
            rating={s.rating}
            notes={s.notes || undefined}
            status={s.status}
            statusLabel={s.statusLabel}
          />
        ))}
      </div>
    </>
  );
}

"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { saveSpeaker, type SaveSpeakerResult, type SpeakerInput } from "@/app/admin/actions";
import { Button, ErrorBanner, MessagePanel, Radio, SpeakerCard, TextField } from "@/components/ui";
import { PHOTO_BUCKET } from "@/lib/photos";
import type { Speaker } from "@/lib/speakers";
import { browserClient } from "@/lib/supabase/client";

type Field = "name" | "type" | "price" | "description" | "photo";
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

function blank(speaker?: Speaker) {
  const d = speaker?.details ?? {};
  return {
    name: speaker?.name ?? "",
    type: speaker?.type ?? "",
    price: speaker ? String(speaker.pricePerMonth) : "",
    description: speaker?.description ?? "",
    kind: d.kind ?? "",
    tuning: d.tuning ?? "",
    size: d.size ?? "",
    room: d.room ?? "",
    connections: d.connections ?? "",
    status: speaker?.status ?? ("available" as const),
  };
}

/** Add or edit a speaker (prototype AdminEdit), with a live Browse preview from 768px. */
export function SpeakerForm({ speaker }: { speaker?: Speaker }) {
  const [v, setV] = useState(() => blank(speaker));
  const [photo, setPhoto] = useState<File>();
  const [preview, setPreview] = useState<string | undefined>(speaker?.photoUrl);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [failure, setFailure] = useState<string>();
  const [saved, setSaved] = useState<Extract<SaveSpeakerResult, { ok: true }>>();
  const [pending, startTransition] = useTransition();

  // Object URLs hold memory until revoked
  useEffect(() => () => (preview?.startsWith("blob:") ? URL.revokeObjectURL(preview) : undefined), [preview]);

  const set = (k: keyof ReturnType<typeof blank>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    setV((s) => ({ ...s, [k]: value }));
    setErrors((x) => ({ ...x, [k === "price" ? "price" : k]: undefined }));
  };
  const price = Number(v.price.replace(/[,\s]/g, ""));

  if (saved) {
    return (
      <MessagePanel
        tone="success"
        title={`${saved.name} is saved.`}
        actions={
          <>
            <Button href="/admin" size="lg">
              Back to speakers
            </Button>
            {speaker ? (
              <Button href="/admin/speakers/new" variant="ghost" size="lg">
                Add another speaker
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  // Already on /admin/speakers/new: reset the form in place
                  setV(blank());
                  setPhoto(undefined);
                  setPreview(undefined);
                  setSaved(undefined);
                }}
              >
                Add another speaker
              </Button>
            )}
          </>
        }
      >
        {saved.status === "rented"
          ? "It shows on Browse as rented until you mark it available."
          : "It shows on Browse as available. Renters can book it now."}
      </MessagePanel>
    );
  }

  function check(): Partial<Record<Field, string>> {
    const e: Partial<Record<Field, string>> = {};
    if (!v.name.trim()) e.name = "Enter the speaker name.";
    if (!v.type.trim()) e.type = "Enter the type and tuning.";
    if (!v.price.trim()) e.price = "Enter the monthly price in shillings.";
    else if (!/^\d{3,7}$/.test(v.price.replace(/[,\s]/g, ""))) e.price = "Enter the price as a whole number, like 14500.";
    if (!v.description.trim()) e.description = "Write a short description of how it sounds.";
    else if (v.description.trim().length < 30) e.description = "Write at least 30 characters so renters know how it sounds.";
    if (photo && photo.size > MAX_PHOTO_BYTES) e.photo = "Choose a photo under 5 MB.";
    return e;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = check();
    setErrors(e);
    const first = (Object.keys(e) as Field[])[0];
    if (first) return document.getElementById(`sf-${first}`)?.focus();

    setFailure(undefined);
    startTransition(async () => {
      let photoPath: string | undefined;
      if (photo) {
        // Upload from the browser as the signed-in admin (storage policies allow admins only);
        // server actions cap request bodies at 1 MB.
        const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
        photoPath = `${crypto.randomUUID()}.${ext}`;
        const { error } = await browserClient().storage.from(PHOTO_BUCKET).upload(photoPath, photo, { contentType: photo.type });
        if (error) return setFailure("The photo didn't upload. Check your connection, then save again. Your entries are kept.");
      }

      const input: SpeakerInput = {
        id: speaker?.id,
        name: v.name,
        type: v.type,
        pricePerMonth: price,
        description: v.description,
        details: { kind: v.kind, tuning: v.tuning, size: v.size, room: v.room, connections: v.connections },
        status: v.status,
        photoPath,
      };
      const r = await saveSpeaker(input);
      if (r.ok) return setSaved(r);
      if (r.field) {
        setErrors({ [r.field]: r.message });
        document.getElementById(`sf-${r.field}`)?.focus();
      } else setFailure(r.message);
    });
  }

  return (
    <>
      <Button href="/admin" variant="ghost" iconStart={ArrowLeft} className="ha-speaker-form__back">
        Speakers
      </Button>
      <h1>{speaker ? `Edit ${speaker.name}` : "Add a speaker"}</h1>
      <div className="ha-speaker-form">
        <form noValidate aria-busy={pending} onSubmit={submit} className="ha-speaker-form__fields">
          {failure && <ErrorBanner title="The speaker was not saved.">{failure}</ErrorBanner>}

          <div className="ha-speaker-form__pair">
            <TextField id="sf-name" label="Name" value={v.name} onChange={set("name")} error={errors.name} placeholder="Ember Monitor" />
            <TextField
              id="sf-price"
              label="Price per month in KES"
              inputMode="numeric"
              value={v.price}
              onChange={set("price")}
              error={errors.price}
              hint="Whole shillings, like 14500."
            />
          </div>
          <TextField
            id="sf-type"
            label="Type and tuning"
            value={v.type}
            onChange={set("type")}
            error={errors.type}
            hint="A few words for the Browse card, like “Bookshelf speaker, warm tuning”."
          />
          <TextField
            id="sf-description"
            label="Description"
            multiline
            rows={4}
            value={v.description}
            onChange={set("description")}
            error={errors.description}
            hint="What it is and how it sounds, in two or three sentences."
          />

          <fieldset className="ha-speaker-form__group">
            <legend className="ha-field__label">Details (optional)</legend>
            <div className="ha-speaker-form__pair">
              <TextField label="Type" value={v.kind} onChange={set("kind")} placeholder="Two-way bookshelf" />
              <TextField label="Tuning" value={v.tuning} onChange={set("tuning")} placeholder="Warm" />
              <TextField label="Size" value={v.size} onChange={set("size")} placeholder="28 cm tall" />
              <TextField label="Best room size" value={v.room} onChange={set("room")} placeholder="Small to medium rooms" />
            </div>
            <TextField label="Connections" value={v.connections} onChange={set("connections")} placeholder="Bluetooth and line-in" />
          </fieldset>

          <TextField
            id="sf-photo"
            label={speaker?.photoUrl ? "Replace photo (optional)" : "Photo (optional)"}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hint="One speaker on a plain ground. JPG, PNG or WebP, under 5 MB."
            error={errors.photo}
            onChange={(e) => {
              const file = (e.currentTarget as HTMLInputElement).files?.[0];
              setPhoto(file);
              setPreview(file ? URL.createObjectURL(file) : speaker?.photoUrl);
              setErrors((x) => ({ ...x, photo: undefined }));
            }}
          />

          <fieldset className="ha-speaker-form__group">
            <legend className="ha-field__label">Status</legend>
            <div className="ha-speaker-form__radios">
              <Radio name="sf-status" label="Available" checked={v.status === "available"} onChange={() => setV((s) => ({ ...s, status: "available" }))} />
              <Radio name="sf-status" label="Rented" checked={v.status === "rented"} onChange={() => setV((s) => ({ ...s, status: "rented" }))} />
            </div>
          </fieldset>

          <div className="ha-speaker-form__buttons">
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? "Saving" : "Save speaker"}
            </Button>
            <Button href="/admin" variant="ghost" size="lg">
              Cancel
            </Button>
          </div>
        </form>

        <aside aria-label="Preview on Browse" className="ha-speaker-form__preview">
          <p className="ha-small ha-speaker-form__muted">How it shows on Browse</p>
          {/* inert: a preview, not a working link */}
          <div inert>
            <SpeakerCard
              href="/"
              name={v.name.trim() || "New speaker"}
              type={v.type.trim() || "Type and tuning"}
              price={`KES ${(price || 0).toLocaleString("en-KE")}`}
              rating={speaker?.rating}
              notes={speaker?.noteCount ?? 0}
              status={v.status === "available" ? "available" : "rented"}
              statusLabel={v.status === "available" ? "Available" : "Rented"}
              photo={preview}
            />
          </div>
        </aside>
      </div>
    </>
  );
}

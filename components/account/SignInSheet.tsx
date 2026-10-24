"use client";

import { useState } from "react";
import { Button, Dialog, TextField } from "@/components/ui";
import { browserClient } from "@/lib/supabase/client";

/** Sign in or create an account in a sheet (claude-design-prompt.md: no separate sign-in screen). */
export function SignInSheet({
  context = "Rent a speaker, track your rental and write listening notes.",
  onClose,
  onSignedIn,
}: {
  context?: string;
  onClose: () => void;
  onSignedIn: () => void;
}) {
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [pending, setPending] = useState(false);

  async function submit(form: FormData) {
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const supabase = browserClient();
    setPending(true);
    setError(undefined);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setPending(false);
      if (error) return setError("That email or password isn't right. Try again.");
      return onSignedIn();
    }

    const name = String(form.get("name") ?? "").trim();
    const area = String(form.get("area") ?? "").trim();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, area: area || undefined } },
    });
    setPending(false);
    if (error) return setError(error.message);
    if (!data.session) return setNotice(`Check ${email} for a link to confirm your account, then sign in.`);
    onSignedIn();
  }

  const creating = mode === "create";
  return (
    <Dialog sheet title={creating ? "Create an account" : "Sign in"} onClose={onClose}>
      <form action={submit} className="ha-signin">
        <p className="ha-signin__context">{context}</p>
        {creating && (
          <>
            <TextField label="Your name" name="name" autoComplete="name" required />
            <TextField label="Area (optional)" name="area" placeholder="Kilimani" hint="Shown with your listening notes." />
          </>
        )}
        <TextField label="Email" name="email" type="email" autoComplete="email" required />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete={creating ? "new-password" : "current-password"}
          minLength={creating ? 8 : undefined}
          hint={creating ? "At least 8 characters." : undefined}
          required
        />
        {error && (
          <p role="alert" className="ha-field__error">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="ha-small">
            {notice}
          </p>
        )}
        <Button type="submit" size="lg" block disabled={pending}>
          {pending ? (creating ? "Creating account" : "Signing in") : creating ? "Create account" : "Sign in"}
        </Button>
        <Button
          variant="ghost"
          block
          onClick={() => {
            setMode(creating ? "signin" : "create");
            setError(undefined);
            setNotice(undefined);
          }}
        >
          {creating ? "I have an account" : "Create account"}
        </Button>
      </form>
    </Dialog>
  );
}

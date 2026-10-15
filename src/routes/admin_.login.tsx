import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  validateSearch: (s: any): { redirect?: string } => ({ redirect: typeof s.redirect === "string" && s.redirect.startsWith("/admin") ? s.redirect : undefined }),
  head: () => ({ meta: [{ title: "Admin sign in — SSIRC" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Login,
});

const schema = z.object({ email: z.string().trim().email("Enter a valid email"), password: z.string().min(8, "Password must be at least 8 characters") });

function Login() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [mode, setMode] = useState<"in" | "up" | "reset">("in");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as any;
    if (mode === "reset") {
      const em = z.string().email().safeParse(fd.email);
      if (!em.success) { toast.error("Enter a valid email"); return; }
      setBusy(true);
      const { error } = await supabase.auth.resetPasswordForEmail(em.data, { redirectTo: `${window.location.origin}/reset-password` });
      setBusy(false);
      { error ? toast.error(error.message) : toast.success("If that account exists, a reset link has been sent."); return; }
    }
    const p = schema.safeParse(fd);
    if (!p.success) { toast.error(p.error.issues[0]?.message ?? "Invalid input"); return; }
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword(p.data);
      setBusy(false);
      if (error) { toast.error("Invalid email or password"); return; }
      navigate({ to: redirect ?? "/admin" });
    } else {
      const { data, error } = await supabase.auth.signUp({ ...p.data, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      if (data.session) navigate({ to: "/admin" });
      else toast.success("Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm rounded-md border bg-card p-8">
        <Logo />
        <h1 className="mt-6 text-xl">{mode === "in" ? "Administrator sign in" : mode === "up" ? "Create administrator account" : "Reset password"}</h1>
        {mode === "up" && <p className="mt-1 text-xs text-muted-foreground">The first account created becomes the administrator. Later accounts have no admin access until granted.</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required /></div>
          {mode !== "reset" && <div className="space-y-1.5"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} required /></div>}
          <Button className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "in" ? "Sign in" : mode === "up" ? "Create account" : "Send reset link"}</Button>
        </form>
        <div className="mt-4 flex flex-col gap-1 text-sm">
          {mode !== "in" && <button className="text-left text-brand hover:underline" onClick={() => setMode("in")}>Back to sign in</button>}
          {mode === "in" && <button className="text-left text-brand hover:underline" onClick={() => setMode("reset")}>Forgot password?</button>}
          {mode === "in" && <button className="text-left text-muted-foreground hover:underline" onClick={() => setMode("up")}>Create an account</button>}
          <Link to="/" className="text-muted-foreground hover:underline">← Back to website</Link>
        </div>
      </div>
    </div>
  );
}

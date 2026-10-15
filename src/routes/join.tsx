import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/ui";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join Us — SSIRC" },
      { name: "description", content: "Apply for membership in Shanti Science ICT and Robotics Club." },
      { property: "og:title", content: "Join SSIRC" },
      { property: "og:description", content: "Apply for membership in SSIRC." },
    ],
  }),
  component: Join,
});

const schema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  level: z.string().trim().max(120).optional(),
  interests: z.string().trim().max(500).optional(),
  skills: z.string().trim().max(1000).optional(),
  motivation: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(3000),
  phone: z.string().trim().max(40).optional(),
  extra: z.string().trim().max(2000).optional(),
});

const BENEFITS = ["Hands-on robotics and electronics workshops", "Programming and AI learning sessions", "Competitions, exhibitions and events", "Mentorship and teamwork on real projects"];

function F({ name, label, required, area, type = "text", errors }: { name: string; label: string; required?: boolean; area?: boolean; type?: string; errors: Record<string, string> }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}{required && <span className="text-destructive"> *</span>}</Label>
      {area ? <Textarea id={name} name={name} rows={4} aria-invalid={!!errors[name]} /> : <Input id={name} name={name} type={type} aria-invalid={!!errors[name]} />}
      {errors[name] && <p className="text-sm text-destructive">{errors[name]}</p>}
    </div>
  );
}

function Join() {
  const [errors, setErrors] = useState<any>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(fd);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    setBusy(true);
    const { error } = await supabase.from("applications").insert(parsed.data as never);
    setBusy(false);
    if (error) { toast.error("Could not submit your application. Please try again."); return; }
    setDone(true);
    toast.success("Application submitted");
  }

  return (
    <>
      <PageHeader eyebrow="Membership" title="Join SSIRC" intro="We welcome students who are curious about science, technology and building things." />
      <div className="container-page section grid gap-10 md:grid-cols-[1fr_1.5fr]">
        <aside className="space-y-4">
          <h2 className="text-xl">Why join?</h2>
          <ul className="space-y-3">{BENEFITS.map((b) => <li key={b} className="flex gap-2 text-sm"><CheckCircle2 className="h-5 w-5 shrink-0 text-success" />{b}</li>)}</ul>
        </aside>
        {done ? (
          <div className="rounded-md border bg-surface p-8">
            <CheckCircle2 className="h-8 w-8 text-success" />
            <h2 className="mt-3 text-2xl">Thank you for applying</h2>
            <p className="mt-2 text-muted-foreground">Your application has been received. The club administrators will review it and contact you by email.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 rounded-md border p-6" noValidate>
            <div className="grid gap-4 sm:grid-cols-2"><F errors={errors} name="full_name" label="Full name" required /><F errors={errors} name="email" label="Email" type="email" required /></div>
            <div className="grid gap-4 sm:grid-cols-2"><F errors={errors} name="level" label="Class / education level" /><F errors={errors} name="phone" label="Phone (optional)" /></div>
            <F errors={errors} name="interests" label="Areas of interest" />
            <F errors={errors} name="skills" label="Relevant skills" area />
            <F errors={errors} name="motivation" label="Why do you want to join?" required area />
            <F errors={errors} name="extra" label="Anything else (optional)" area />
            <Button type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit application"}</Button>
          </form>
        )}
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, SocialLinks } from "@/components/site/ui";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SSIRC" },
      { name: "description", content: "Get in touch with Shanti Science ICT and Robotics Club." },
      { property: "og:title", content: "Contact SSIRC" },
      { property: "og:description", content: "Get in touch with SSIRC." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5, "Message is too short").max(5000),
});

function Contact() {
  const { data } = useSuspenseQuery(settingsQuery);
  const g: any = data.general ?? {};
  const [errors, setErrors] = useState<any>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = schema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) { setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setErrors({});
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data as never);
    setBusy(false);
    if (error) { toast.error("Message could not be sent. Please try again."); return; }
    form.reset();
    toast.success("Message sent. We'll get back to you soon.");
  }

  return (
    <>
      <PageHeader eyebrow="Contact" title="Get in touch" intro="Questions, collaborations or invitations — we'd like to hear from you." />
      <div className="container-page section grid gap-10 md:grid-cols-[1fr_1.5fr]">
        <aside className="space-y-3 text-sm">
          {g.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-light" />{g.email}</p>}
          {g.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-light" />{g.phone}</p>}
          {g.location && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-light" />{g.location}</p>}
          <SocialLinks links={g} />
        </aside>
        <form onSubmit={submit} noValidate className="space-y-4 rounded-md border p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="name">Name *</Label><Input id="name" name="name" />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
            <div className="space-y-1.5"><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" />{errors.email && <p className="text-sm text-destructive">{errors.email}</p>}</div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" /></div>
          <div className="space-y-1.5"><Label htmlFor="message">Message *</Label><Textarea id="message" name="message" rows={6} />{errors.message && <p className="text-sm text-destructive">{errors.message}</p>}</div>
          <Button type="submit" disabled={busy}>{busy ? "Sending…" : "Send message"}</Button>
        </form>
      </div>
    </>
  );
}

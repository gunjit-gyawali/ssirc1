/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ImageUpload } from "@/components/admin/ImageUpload";

const NAMES: Record<string, string> = {
  hero: "Hero", about: "About SSIRC", stats: "Club statistics", bod: "Board of Directors", projects: "Featured projects",
  events: "Upcoming events", achievements: "Achievements & news", spotlight: "Member spotlight", gallery: "Gallery preview",
  join: "Join the club", contact: "Contact preview",
};

export const Route = createFileRoute("/admin/homepage")({ component: Page });

function Page() {
  return (
    <div className="space-y-10">
      <SettingsForm k="homepage" title="Homepage sections">
        {(v, set) => {
          const order: string[] = v.sections?.length ? v.sections : Object.keys(NAMES);
          const hidden: string[] = v.hidden ?? [];
          const move = (i: number, d: number) => {
            const n = [...order];
            [n[i], n[i + d]] = [n[i + d]!, n[i]!];
            set({ sections: n });
          };
          return (
            <ul className="divide-y rounded-md border">
              {order.map((k, i) => (
                <li key={k} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="text-sm font-medium">{NAMES[k] ?? k}</span>
                  <div className="flex items-center gap-2">
                    <Switch checked={!hidden.includes(k)} onCheckedChange={(on) => set({ hidden: on ? hidden.filter((h) => h !== k) : [...hidden, k] })} aria-label={`Show ${NAMES[k]}`} />
                    <Button variant="ghost" size="icon" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" disabled={i === order.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          );
        }}
      </SettingsForm>
      <SettingsForm k="general" title="Hero content">
        {(v: any, set) => (
          <>
            <div className="space-y-1.5"><Label htmlFor="tagline">Headline</Label><Input id="tagline" value={v.tagline ?? ""} onChange={(e) => set({ tagline: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor="intro">Introduction</Label><Textarea id="intro" rows={3} value={v.intro ?? ""} onChange={(e) => set({ intro: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Hero image (optional — replaces default)</Label><ImageUpload value={v.hero_image} onChange={(u) => set({ hero_image: u })} folder="homepage" /></div>
          </>
        )}
      </SettingsForm>
    </div>
  );
}

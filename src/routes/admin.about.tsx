import { createFileRoute } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SettingsForm } from "@/components/admin/SettingsForm";

const TEXT: [string, string][] = [["introduction", "Introduction"], ["history", "Background & history"], ["mission", "Mission"], ["vision", "Vision"], ["structure", "Organizational structure"]];
const LISTS: [string, string][] = [["objectives", "Objectives (one per line)"], ["values", "Core values (one per line)"]];

export const Route = createFileRoute("/admin/about")({
  component: () => (
    <SettingsForm k="about" title="About page">
      {(v, set) => (
        <>
          {TEXT.map(([k, l]) => (
            <div key={k} className="space-y-1.5"><Label htmlFor={k}>{l}</Label><Textarea id={k} rows={4} value={v[k] ?? ""} onChange={(e) => set({ [k]: e.target.value })} /></div>
          ))}
          {LISTS.map(([k, l]) => (
            <div key={k} className="space-y-1.5"><Label htmlFor={k}>{l}</Label><Textarea id={k} rows={5} value={(v[k] ?? []).join("\n")} onChange={(e) => set({ [k]: e.target.value.split("\n") })} onBlur={(e) => set({ [k]: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} /></div>
          ))}
        </>
      )}
    </SettingsForm>
  ),
});

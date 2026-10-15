import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsForm } from "@/components/admin/SettingsForm";

const FIELDS: [string, string][] = [
  ["email", "Official email"],
  ["phone", "Phone"],
  ["location", "Location"],
  ["facebook", "Facebook URL"],
  ["instagram", "Instagram URL"],
  ["youtube", "YouTube URL"],
  ["github", "GitHub URL"],
];

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <SettingsForm k="general" title="Site settings & contact">
      {(v, set) =>
        FIELDS.map(([k, l]) => (
          <div key={k} className="space-y-1.5">
            <Label htmlFor={k}>{l}</Label>
            <Input id={k} value={v[k] ?? ""} onChange={(e) => set({ [k]: e.target.value })} />
          </div>
        ))
      }
    </SettingsForm>
  ),
});

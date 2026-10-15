/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function useSetting(key: string) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "setting", key],
    queryFn: async () => ((await supabase.from("site_settings").select("value").eq("key", key).maybeSingle()).data?.value ?? {}) as any,
  });
  const save = async (value: any) => {
    const { error } = await supabase.from("site_settings").upsert({ key, value });
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin", "setting", key] });
    qc.invalidateQueries({ queryKey: ["settings"] });
  };
  return { ...q, save };
}

export function SettingsForm({ k, title, children }: { k: string; title: string; children: (v: any, set: (patch: any) => void) => ReactNode }) {
  const { data, isLoading, save } = useSetting(k);
  const [v, setV] = useState<any>(null);
  useEffect(() => { if (data) setV(data); }, [data]);
  if (isLoading || !v) return <p className="text-muted-foreground">Loading…</p>;
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl">{title}</h1>
      <div className="space-y-5 rounded-md border bg-card p-6">
        {children(v, (patch) => setV((o: any) => ({ ...o, ...patch })))}
        <Button onClick={() => save(v)}>Save changes</Button>
      </div>
    </div>
  );
}

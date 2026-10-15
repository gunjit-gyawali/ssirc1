import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

const TABLES = [
  ["members", "Members", "/admin/members"],
  ["projects", "Projects", "/admin/projects"],
  ["events", "Events", "/admin/events"],
  ["achievements", "Achievements", "/admin/achievements"],
  ["news", "News", "/admin/news"],
  ["gallery_images", "Gallery images", "/admin/gallery"],
  ["applications", "Applications", "/admin/applications"],
  ["contact_messages", "Messages", "/admin/messages"],
] as const;

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const out: any = {};
      await Promise.all(TABLES.map(async ([t]) => {
        const { count } = await supabase.from(t).select("id", { count: "exact", head: true });
        out[t] = count ?? 0;
      }));
      const { count } = await supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "Pending");
      out.pending = count ?? 0;
      return out;
    },
  });
  return (
    <div>
      <h1 className="text-2xl">Dashboard</h1>
      {!!data?.pending && <p className="mt-2 text-sm text-warning">{data.pending} membership application(s) awaiting review.</p>}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TABLES.map(([t, l, to]) => (
          <Link key={t} to={to} className="rounded-md border bg-card p-5 hover:shadow-sm">
            <p className="text-sm text-muted-foreground">{l}</p>
            <p className="mt-1 text-3xl font-bold text-brand">{data?.[t] ?? "–"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

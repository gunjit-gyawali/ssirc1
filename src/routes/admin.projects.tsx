/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AdminCrud, PubBadge } from "@/components/admin/AdminCrud";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/projects")({ component: Page });

function MemberPicker({ row, setRow }: { row: any; setRow: (r: any) => void }) {
  const { data: members = [] } = useQuery({
    queryKey: ["admin", "members-mini"],
    queryFn: async () => (await supabase.from("members").select("id,full_name").order("full_name")).data ?? [],
  });
  useEffect(() => {
    if (row.__members !== undefined) return;
    if (!row.id) return setRow((r: any) => ({ ...r, __members: [] }));
    supabase.from("project_members").select("member_id").eq("project_id", row.id).then(({ data }) => {
      setRow((r: any) => ({ ...r, __members: (data ?? []).map((d) => d.member_id) }));
    });
  }, [row.id, row.__members, setRow]);
  const sel: string[] = row.__members ?? [];
  const toggle = (id: string) => {
    const next = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id];
    setRow((r: any) => ({
      ...r,
      __members: next,
      __after: async (pid: string) => {
        await supabase.from("project_members").delete().eq("project_id", pid);
        if (next.length) await supabase.from("project_members").insert(next.map((m) => ({ project_id: pid, member_id: m })));
      },
    }));
  };
  return (
    <div className="space-y-2">
      <Label>Team members</Label>
      <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-md border p-3">
        {members.length ? members.map((m) => (
          <label key={m.id} className="flex items-center gap-2 text-sm"><Checkbox checked={sel.includes(m.id)} onCheckedChange={() => toggle(m.id)} />{m.full_name}</label>
        )) : <p className="text-sm text-muted-foreground">Add members first.</p>}
      </div>
    </div>
  );
}

function Page() {
  return (
    <AdminCrud
      table="projects"
      title="Projects"
      searchKeys={["title", "category", "status"]}
      filterField={{ name: "status", options: PROJECT_STATUSES }}
      defaults={{ category: "Robotics", status: "Planned" }}
      previewPath={(r) => (r.published ? `/projects/${r.slug}` : null)}
      extraEditor={(row, setRow) => <MemberPicker row={row} setRow={setRow} />}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "status", label: "Status" },
        { key: "featured", label: "Featured", render: (r) => <PubBadge on={r.featured} label="Featured" /> },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "URL slug", type: "slug", from: "title" },
        { name: "cover_url", label: "Cover image", type: "image" },
        { name: "summary", label: "Short description", type: "textarea" },
        { name: "description", label: "Detailed description", type: "textarea" },
        { name: "problem", label: "Problem statement", type: "textarea" },
        { name: "solution", label: "Proposed solution", type: "textarea" },
        { name: "methodology", label: "Methodology", type: "textarea" },
        { name: "technologies", label: "Technologies used", type: "tags" },
        { name: "category", label: "Category", type: "select", options: PROJECT_CATEGORIES },
        { name: "status", label: "Status", type: "select", options: PROJECT_STATUSES },
        { name: "start_date", label: "Start date", type: "date" },
        { name: "end_date", label: "Completion date", type: "date" },
        { name: "github_url", label: "GitHub URL", type: "url" },
        { name: "demo_url", label: "Live demo URL", type: "url" },
        { name: "featured", label: "Feature on homepage", type: "bool" },
        { name: "published", label: "Published", type: "bool" },
      ]}
    />
  );
}

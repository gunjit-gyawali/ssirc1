/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminCrud } from "@/components/admin/AdminCrud";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/applications")({ component: Page });

async function exportCsv() {
  const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
  const rows = data ?? [];
  const cols = ["created_at", "full_name", "email", "phone", "level", "interests", "skills", "motivation", "status"];
  const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...rows.map((r: any) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `ssirc-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

function Page() {
  return (
    <div>
      <div className="mb-2 flex justify-end"><Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</Button></div>
      <AdminCrud
        table="applications"
        title="Membership applications"
        canCreate={false}
        searchKeys={["full_name", "email", "interests"]}
        filterField={{ name: "status", options: APPLICATION_STATUSES }}
        columns={[
          { key: "created_at", label: "Received", render: (r) => formatDate(r.created_at) },
          { key: "full_name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "status", label: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge> },
        ]}
        fields={[
          { name: "status", label: "Status", type: "select", options: APPLICATION_STATUSES },
          { name: "admin_notes", label: "Private admin notes", type: "textarea" },
          { name: "full_name", label: "Full name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "phone", label: "Phone", type: "text" },
          { name: "level", label: "Class / level", type: "text" },
          { name: "interests", label: "Interests", type: "text" },
          { name: "skills", label: "Skills", type: "textarea" },
          { name: "motivation", label: "Motivation", type: "textarea" },
          { name: "extra", label: "Additional info", type: "textarea" },
        ]}
      />
    </div>
  );
}

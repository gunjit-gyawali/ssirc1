import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { AdminCrud } from "@/components/admin/AdminCrud";
import { MESSAGE_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/queries";

export const Route = createFileRoute("/admin/messages")({
  component: () => (
    <AdminCrud
      table="contact_messages"
      title="Contact messages"
      canCreate={false}
      searchKeys={["name", "email", "subject", "message"]}
      filterField={{ name: "status", options: MESSAGE_STATUSES }}
      columns={[
        { key: "created_at", label: "Received", render: (r) => formatDate(r.created_at, true) },
        { key: "name", label: "Name" },
        { key: "subject", label: "Subject" },
        { key: "status", label: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge> },
      ]}
      fields={[
        { name: "status", label: "Status", type: "select", options: MESSAGE_STATUSES },
        { name: "name", label: "Name", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "subject", label: "Subject", type: "text" },
        { name: "message", label: "Message", type: "textarea" },
      ]}
    />
  ),
});

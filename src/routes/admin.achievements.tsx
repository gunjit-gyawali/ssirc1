import { createFileRoute } from "@tanstack/react-router";
import { AdminCrud } from "@/components/admin/AdminCrud";

export const Route = createFileRoute("/admin/achievements")({
  component: () => (
    <AdminCrud
      table="achievements"
      title="Achievements"
      orderBy="achieved_on"
      searchKeys={["title", "organization", "recipient"]}
      columns={[
        { key: "title", label: "Title" },
        { key: "achieved_on", label: "Date" },
        { key: "recipient", label: "Recipient" },
      ]}
      fields={[
        { name: "title", label: "Award title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "achieved_on", label: "Date", type: "date" },
        { name: "organization", label: "Awarding organization", type: "text" },
        { name: "recipient", label: "Recipient or team", type: "text" },
        { name: "category", label: "Category", type: "text" },
        { name: "image_url", label: "Image", type: "image" },
        { name: "link_url", label: "Supporting link", type: "url" },
        { name: "featured", label: "Featured", type: "bool" },
        { name: "published", label: "Published", type: "bool" },
      ]}
    />
  ),
});

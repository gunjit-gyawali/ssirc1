import { createFileRoute } from "@tanstack/react-router";
import { AdminCrud } from "@/components/admin/AdminCrud";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/queries";

export const Route = createFileRoute("/admin/events")({
  component: () => (
    <AdminCrud
      table="events"
      title="Events"
      orderBy="starts_at"
      searchKeys={["title", "venue", "category"]}
      filterField={{ name: "category", options: EVENT_CATEGORIES }}
      previewPath={(r) => (r.published ? `/events/${r.slug}` : null)}
      columns={[
        { key: "title", label: "Title" },
        { key: "starts_at", label: "Date", render: (r) => formatDate(r.starts_at, true) },
        { key: "venue", label: "Venue" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "URL slug", type: "slug", from: "title" },
        { name: "poster_url", label: "Poster", type: "image" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "starts_at", label: "Start date & time", type: "datetime", required: true },
        { name: "ends_at", label: "End date & time", type: "datetime" },
        { name: "venue", label: "Venue", type: "text" },
        { name: "category", label: "Category", type: "select", options: EVENT_CATEGORIES },
        { name: "organizer", label: "Organizer", type: "text" },
        { name: "registration_url", label: "Registration URL", type: "url" },
        { name: "results", label: "Results / summary (after event)", type: "textarea" },
        { name: "featured", label: "Featured", type: "bool" },
        { name: "published", label: "Published", type: "bool" },
      ]}
    />
  ),
});

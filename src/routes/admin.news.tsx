import { createFileRoute } from "@tanstack/react-router";
import { AdminCrud } from "@/components/admin/AdminCrud";

export const Route = createFileRoute("/admin/news")({
  component: () => (
    <AdminCrud
      table="news"
      title="News articles"
      orderBy="published_at"
      searchKeys={["title", "author", "category"]}
      previewPath={(r) => (r.published ? `/news/${r.slug}` : null)}
      columns={[
        { key: "title", label: "Title" },
        { key: "published_at", label: "Date" },
        { key: "author", label: "Author" },
      ]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "URL slug", type: "slug", from: "title" },
        { name: "cover_url", label: "Cover image", type: "image" },
        { name: "summary", label: "Summary", type: "textarea" },
        { name: "content", label: "Article content", type: "textarea" },
        { name: "published_at", label: "Publication date", type: "date" },
        { name: "author", label: "Author", type: "text" },
        { name: "category", label: "Category", type: "text" },
        { name: "published", label: "Published", type: "bool" },
      ]}
    />
  ),
});

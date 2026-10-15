import { createFileRoute } from "@tanstack/react-router";
import { AdminCrud, PubBadge } from "@/components/admin/AdminCrud";
import { MEMBER_CATEGORIES } from "@/lib/constants";

export const Route = createFileRoute("/admin/members")({
  component: () => (
    <AdminCrud
      table="members"
      title="Members & BOD"
      orderBy="display_order"
      ascending
      searchKeys={["full_name", "designation", "category"]}
      filterField={{ name: "category", options: MEMBER_CATEGORIES }}
      defaults={{ category: "General Members", display_order: 0 }}
      previewPath={(r) => (r.published ? `/members/${r.slug}` : null)}
      columns={[
        { key: "full_name", label: "Name" },
        { key: "designation", label: "Designation" },
        { key: "category", label: "Category" },
        { key: "featured", label: "Featured", render: (r) => <PubBadge on={r.featured} label="Featured" /> },
      ]}
      fields={[
        { name: "full_name", label: "Full name", type: "text", required: true },
        { name: "slug", label: "URL slug", type: "slug", from: "full_name" },
        { name: "photo_url", label: "Photo", type: "image" },
        { name: "designation", label: "Designation", type: "text", help: "e.g. President, Treasurer, Technical Coordinator" },
        { name: "category", label: "Team / category", type: "select", options: MEMBER_CATEGORIES },
        { name: "short_bio", label: "Short biography", type: "textarea" },
        { name: "full_bio", label: "Full biography", type: "textarea" },
        { name: "email", label: "Email", type: "email" },
        { name: "show_email", label: "Show email publicly", type: "bool" },
        { name: "skills", label: "Skills & interests", type: "tags" },
        { name: "education", label: "Education", type: "text" },
        { name: "github_url", label: "GitHub URL", type: "url" },
        { name: "linkedin_url", label: "LinkedIn URL", type: "url" },
        { name: "website_url", label: "Personal website", type: "url" },
        { name: "display_order", label: "Display order", type: "number" },
        { name: "featured", label: "Feature on homepage", type: "bool" },
        { name: "published", label: "Published", type: "bool" },
      ]}
    />
  ),
});

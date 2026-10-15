import { createFileRoute } from "@tanstack/react-router";
import { AdminCrud } from "@/components/admin/AdminCrud";
import { GALLERY_CATEGORIES } from "@/lib/constants";

export const Route = createFileRoute("/admin/gallery")({
  component: () => (
    <AdminCrud
      table="gallery_images"
      title="Gallery"
      orderBy="display_order"
      ascending
      searchKeys={["caption", "album", "category"]}
      filterField={{ name: "category", options: GALLERY_CATEGORIES }}
      defaults={{ published: true, display_order: 0 }}
      columns={[
        { key: "image_url", label: "Image", render: (r) => <img src={r.image_url} alt="" className="h-12 w-16 rounded-sm object-cover" /> },
        { key: "caption", label: "Caption" },
        { key: "album", label: "Album" },
        { key: "category", label: "Category" },
      ]}
      fields={[
        { name: "image_url", label: "Image", type: "image", required: true },
        { name: "caption", label: "Caption", type: "text" },
        { name: "album", label: "Album / event", type: "text" },
        { name: "category", label: "Category", type: "select", options: GALLERY_CATEGORIES },
        { name: "display_order", label: "Display order", type: "number" },
        { name: "featured", label: "Featured", type: "bool" },
        { name: "published", label: "Published", type: "bool" },
      ]}
    />
  ),
});

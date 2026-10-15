import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Empty, PageHeader } from "@/components/site/ui";
import { FilterSelect } from "@/components/site/FilterSelect";
import { listQuery } from "@/lib/queries";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import type { Row } from "@/lib/public.functions";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — SSIRC" },
      { name: "description", content: "Photos from SSIRC events, workshops, exhibitions and competitions." },
      { property: "og:title", content: "Gallery — SSIRC" },
      { property: "og:description", content: "Photos from SSIRC activities." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(listQuery({ table: "gallery_images" })),
  component: Gallery,
});

function Gallery() {
  const { data } = useSuspenseQuery(listQuery({ table: "gallery_images" }));
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<Row | null>(null);
  const list = useMemo(() => data.filter((g) => cat === "all" || g.category === cat), [data, cat]);
  return (
    <>
      <PageHeader eyebrow="Gallery" title="Club moments" intro="Snapshots from our events, workshops and projects." />
      <div className="container-page section">
        <div className="mb-8"><FilterSelect value={cat} onChange={setCat} options={GALLERY_CATEGORIES} label="Categories" /></div>
        {list.length ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {list.map((g) => (
              <button key={g.id} onClick={() => setOpen(g)} className="group overflow-hidden rounded-md border focus-visible:ring-2 focus-visible:ring-ring" aria-label={`View ${g.caption || "photo"}`}>
                <img src={g.image_url} alt={g.caption || "Club photo"} loading="lazy" className="aspect-square w-full object-cover transition-transform group-hover:scale-[1.02]" />
              </button>
            ))}
          </div>
        ) : <Empty>No photos yet.</Empty>}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-4xl">
          <DialogTitle>{open?.caption || "Photo"}</DialogTitle>
          {open && <img src={open.image_url} alt={open.caption || "Club photo"} className="max-h-[75vh] w-full rounded-md object-contain" />}
          {open?.album && <p className="text-sm text-muted-foreground">{open.album}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}

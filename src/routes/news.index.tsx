import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, Img, PageHeader } from "@/components/site/ui";
import { formatDate, listQuery } from "@/lib/queries";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "News — SSIRC" },
      { name: "description", content: "Announcements and articles from SSIRC." },
      { property: "og:title", content: "News — SSIRC" },
      { property: "og:description", content: "Announcements and articles from SSIRC." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(listQuery({ table: "news" })),
  component: News,
});

function News() {
  const { data } = useSuspenseQuery(listQuery({ table: "news" }));
  return (
    <>
      <PageHeader eyebrow="Updates" title="News & announcements" />
      <div className="container-page section">
        {data.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {data.map((n) => (
              <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="group overflow-hidden rounded-md border bg-card hover:shadow-md">
                <Img src={n.cover_url} alt={n.title} className="aspect-video w-full" />
                <div className="p-5">
                  <p className="text-xs text-muted-foreground">{formatDate(n.published_at)}{n.category && ` · ${n.category}`}</p>
                  <h2 className="mt-1 text-lg group-hover:underline">{n.title}</h2>
                  {n.summary && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{n.summary}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : <Empty>No news published yet.</Empty>}
      </div>
    </>
  );
}

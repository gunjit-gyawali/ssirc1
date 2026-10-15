import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Img } from "@/components/site/ui";
import { formatDate, slugQuery } from "@/lib/queries";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ context, params }) => {
    const d = await context.queryClient.ensureQueryData(slugQuery({ table: "news", slug: params.slug }));
    if (!d.row) throw notFound();
    return { title: d.row.title as string, desc: (d.row.summary ?? "") as string };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — SSIRC News` },
          { name: "description", content: loaderData.desc },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.desc },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Article not found — SSIRC" }, { name: "robots", content: "noindex" }],
  }),
  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(slugQuery({ table: "news", slug }));
  const n = data.row!;
  return (
    <article className="container-page section max-w-3xl">
      <Link to="/news" className="text-sm text-muted-foreground hover:text-brand">← All news</Link>
      <p className="mt-4 text-sm text-muted-foreground">{formatDate(n.published_at)}{n.author && ` · ${n.author}`}{n.category && ` · ${n.category}`}</p>
      <h1 className="mt-2 text-3xl md:text-4xl">{n.title}</h1>
      {n.summary && <p className="mt-3 text-lg text-muted-foreground">{n.summary}</p>}
      {n.cover_url && <Img src={n.cover_url} alt={n.title} className="mt-8 aspect-video w-full rounded-md border" />}
      <div className="prose-body mt-8">{n.content}</div>
    </article>
  );
}

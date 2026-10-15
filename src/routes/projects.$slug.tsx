import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Img, MemberCard } from "@/components/site/ui";
import { formatDate, slugQuery } from "@/lib/queries";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const d = await context.queryClient.ensureQueryData(slugQuery({ table: "projects", slug: params.slug }));
    if (!d.row) throw notFound();
    return { title: d.row.title as string, desc: (d.row.summary ?? "") as string };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — SSIRC Projects` },
          { name: "description", content: loaderData.desc },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.desc },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Project not found — SSIRC" }, { name: "robots", content: "noindex" }],
  }),
  component: Project,
});

function Block({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return <section className="mt-8"><h2 className="text-xl">{title}</h2><p className="prose-body mt-2 text-foreground/90">{text}</p></section>;
}

function Project() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(slugQuery({ table: "projects", slug }));
  const p = data.row!;
  return (
    <div className="container-page section max-w-4xl">
      <Link to="/projects" className="text-sm text-muted-foreground hover:text-brand">← All projects</Link>
      <div className="mt-4 flex flex-wrap gap-2"><Badge variant="outline">{p.category}</Badge><Badge variant="secondary">{p.status}</Badge></div>
      <h1 className="mt-3 text-3xl md:text-4xl">{p.title}</h1>
      {p.summary && <p className="mt-3 text-lg text-muted-foreground">{p.summary}</p>}
      <p className="mt-2 text-sm text-muted-foreground">{[p.start_date && `Started ${formatDate(p.start_date)}`, p.end_date && `Completed ${formatDate(p.end_date)}`].filter(Boolean).join(" · ")}</p>
      <Img src={p.cover_url} alt={p.title} className="mt-8 aspect-video w-full rounded-md border" />
      <div className="mt-6 flex flex-wrap gap-3">
        {p.github_url && <Button asChild variant="outline"><a href={p.github_url} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /> Repository</a></Button>}
        {p.demo_url && <Button asChild><a href={p.demo_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /> Live demo</a></Button>}
      </div>
      <Block title="Overview" text={p.description} />
      <Block title="Problem statement" text={p.problem} />
      <Block title="Proposed solution" text={p.solution} />
      <Block title="Methodology" text={p.methodology} />
      {p.technologies?.length > 0 && <section className="mt-8"><h2 className="mb-3 text-xl">Technologies</h2><div className="flex flex-wrap gap-2">{p.technologies.map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}</div></section>}
      {data.related.length > 0 && <section className="mt-10"><h2 className="mb-4 text-xl">Team</h2><div className="grid grid-cols-2 gap-5 md:grid-cols-4">{data.related.map((m) => <MemberCard key={m.id} m={m} />)}</div></section>}
    </div>
  );
}

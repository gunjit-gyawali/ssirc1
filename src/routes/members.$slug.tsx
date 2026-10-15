import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Img, ProjectCard, SocialLinks } from "@/components/site/ui";
import { formatDate, slugQuery } from "@/lib/queries";

export const Route = createFileRoute("/members/$slug")({
  loader: async ({ context, params }) => {
    const d = await context.queryClient.ensureQueryData(slugQuery({ table: "members", slug: params.slug }));
    if (!d.row) throw notFound();
    return { name: d.row.full_name as string, desc: (d.row.short_bio || d.row.designation || "") as string };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — SSIRC` },
          { name: "description", content: loaderData.desc || `Portfolio of ${loaderData.name} at SSIRC.` },
          { property: "og:title", content: `${loaderData.name} — SSIRC` },
          { property: "og:description", content: loaderData.desc || `Portfolio of ${loaderData.name}.` },
          { property: "og:type", content: "profile" },
        ]
      : [{ title: "Member not found — SSIRC" }, { name: "robots", content: "noindex" }],
  }),
  component: Member,
});

function Member() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(slugQuery({ table: "members", slug }));
  const m = data.row!;
  return (
    <div className="container-page section">
      <Link to="/members" className="text-sm text-muted-foreground hover:text-brand">← All members</Link>
      <div className="mt-6 grid gap-10 md:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <Img src={m.photo_url} alt={m.full_name} icon="user" className="aspect-[4/5] w-full rounded-md border" />
          {m.show_email && m.email && <a href={`mailto:${m.email}`} className="flex items-center gap-2 text-sm text-brand"><Mail className="h-4 w-4" />{m.email}</a>}
          <SocialLinks links={m} />
        </aside>
        <article>
          <p className="eyebrow">{m.category}</p>
          <h1 className="mt-1 text-3xl">{m.full_name}</h1>
          {m.designation && <p className="mt-1 text-lg text-brand-light">{m.designation}</p>}
          {(m.term_start || m.education) && <p className="mt-2 text-sm text-muted-foreground">{m.education}</p>}
          {m.full_bio || m.short_bio ? <p className="prose-body mt-6">{m.full_bio || m.short_bio}</p> : null}
          {m.skills?.length > 0 && (
            <div className="mt-8"><h2 className="mb-3 text-lg">Skills & interests</h2><div className="flex flex-wrap gap-2">{m.skills.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}</div></div>
          )}
          {data.related.length > 0 && (
            <div className="mt-10"><h2 className="mb-4 text-lg">Projects</h2><div className="grid gap-5 sm:grid-cols-2">{data.related.map((p) => <ProjectCard key={p.id} p={p} />)}</div></div>
          )}
          <p className="mt-10 text-xs text-muted-foreground">Profile updated {formatDate(m.updated_at)}</p>
        </article>
      </div>
    </div>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Img } from "@/components/site/ui";
import { formatDate, slugQuery } from "@/lib/queries";

export const Route = createFileRoute("/events/$slug")({
  loader: async ({ context, params }) => {
    const d = await context.queryClient.ensureQueryData(slugQuery({ table: "events", slug: params.slug }));
    if (!d.row) throw notFound();
    return { title: d.row.title as string, desc: ((d.row.description ?? "") as string).slice(0, 160) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — SSIRC Events` },
          { name: "description", content: loaderData.desc },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.desc },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Event not found — SSIRC" }, { name: "robots", content: "noindex" }],
  }),
  component: EventPage,
});

function EventPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(slugQuery({ table: "events", slug }));
  const e = data.row!;
  const upcoming = new Date(e.starts_at).getTime() >= Date.now();
  return (
    <div className="container-page section max-w-4xl">
      <Link to="/events" className="text-sm text-muted-foreground hover:text-brand">← All events</Link>
      <p className="eyebrow mt-4">{e.category}</p>
      <h1 className="mt-1 text-3xl md:text-4xl">{e.title}</h1>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(e.starts_at, true)}{e.ends_at && ` – ${formatDate(e.ends_at, true)}`}</span>
        {e.venue && <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{e.venue}</span>}
        {e.organizer && <span className="flex items-center gap-2"><User className="h-4 w-4" />{e.organizer}</span>}
      </div>
      {upcoming && e.registration_url && <Button asChild className="mt-6"><a href={e.registration_url} target="_blank" rel="noopener noreferrer">Register</a></Button>}
      <Img src={e.poster_url} alt={e.title} className="mt-8 aspect-video w-full rounded-md border" />
      {e.description && <p className="prose-body mt-8">{e.description}</p>}
      {e.results && <section className="mt-10 rounded-md border bg-surface p-6"><h2 className="text-xl">Results & summary</h2><p className="prose-body mt-2">{e.results}</p></section>}
    </div>
  );
}

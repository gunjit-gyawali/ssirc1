import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Award } from "lucide-react";
import { Empty, Img, PageHeader } from "@/components/site/ui";
import { formatDate, listQuery } from "@/lib/queries";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — SSIRC" },
      { name: "description", content: "Awards, competition results and milestones of SSIRC." },
      { property: "og:title", content: "Achievements — SSIRC" },
      { property: "og:description", content: "Awards and milestones of SSIRC." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(listQuery({ table: "achievements" })),
  component: Achievements,
});

function Achievements() {
  const { data } = useSuspenseQuery(listQuery({ table: "achievements" }));
  return (
    <>
      <PageHeader eyebrow="Recognition" title="Achievements" intro="Awards, competition results and milestones earned by our members." />
      <div className="container-page section">
        {data.length ? (
          <ul className="space-y-4">
            {data.map((a) => (
              <li key={a.id} className="grid gap-5 rounded-md border bg-card p-5 sm:grid-cols-[160px_1fr]">
                {a.image_url ? <Img src={a.image_url} alt={a.title} className="aspect-[4/3] w-full rounded-sm" /> : <div className="flex aspect-[4/3] items-center justify-center rounded-sm bg-subtle"><Award className="h-8 w-8 text-brand-light" /></div>}
                <div>
                  <p className="text-sm text-muted-foreground">{[a.category, formatDate(a.achieved_on)].filter(Boolean).join(" · ")}</p>
                  <h2 className="mt-1 text-xl">{a.title}</h2>
                  <p className="text-sm text-brand-light">{[a.recipient, a.organization].filter(Boolean).join(" — ")}</p>
                  {a.description && <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>}
                  {a.link_url && <a href={a.link_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-brand underline">Learn more</a>}
                </div>
              </li>
            ))}
          </ul>
        ) : <Empty>Achievements will be listed here once added.</Empty>}
      </div>
    </>
  );
}

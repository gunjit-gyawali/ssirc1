import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Bot, FlaskConical, Code2, Monitor, CircuitBoard, BrainCircuit, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/ui";
import { settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — SSIRC" },
      { name: "description", content: "Mission, vision, objectives and history of Shanti Science ICT and Robotics Club." },
      { property: "og:title", content: "About Us — SSIRC" },
      { property: "og:description", content: "Mission, vision, objectives and history of SSIRC." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: About,
});

const AREAS = [
  { t: "Robotics and automation", I: Bot },
  { t: "Science experiments and research", I: FlaskConical },
  { t: "Programming and software development", I: Code2 },
  { t: "ICT education", I: Monitor },
  { t: "Electronics and embedded systems", I: CircuitBoard },
  { t: "Artificial intelligence", I: BrainCircuit },
  { t: "Innovation and problem-solving", I: Lightbulb },
];

function About() {
  const { data } = useSuspenseQuery(settingsQuery);
  const a: any = data.about ?? {};
  return (
    <>
      <PageHeader eyebrow="About us" title="Shanti Science ICT and Robotics Club" intro={a.introduction} />
      <section className="section">
        <div className="container-page grid gap-10 md:grid-cols-[2fr_1fr]">
          <div className="space-y-10">
            <div><h2 className="text-2xl">Our history</h2><p className="prose-body mt-3 text-muted-foreground">{a.history}</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border p-6"><h3 className="text-lg">Mission</h3><p className="mt-2 text-sm text-muted-foreground">{a.mission}</p></div>
              <div className="rounded-md border p-6"><h3 className="text-lg">Vision</h3><p className="mt-2 text-sm text-muted-foreground">{a.vision}</p></div>
            </div>
            {Array.isArray(a.objectives) && (
              <div><h2 className="text-2xl">Objectives</h2><ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted-foreground">{a.objectives.map((o: string) => <li key={o}>{o}</li>)}</ol></div>
            )}
            {a.structure && <div><h2 className="text-2xl">Organizational structure</h2><p className="prose-body mt-3 text-muted-foreground">{a.structure}</p></div>}
          </div>
          <aside className="space-y-6">
            {Array.isArray(a.values) && (
              <div className="rounded-md border bg-surface p-6">
                <h2 className="text-lg">Core values</h2>
                <ul className="mt-3 flex flex-wrap gap-2">{a.values.map((v: string) => <li key={v} className="rounded-sm border bg-card px-2.5 py-1 text-sm">{v}</li>)}</ul>
              </div>
            )}
            <div className="rounded-md border bg-accent p-6">
              <h2 className="text-lg">Become a member</h2>
              <p className="mt-2 text-sm text-muted-foreground">Students curious about science and technology are welcome.</p>
              <Button asChild className="mt-4"><Link to="/join">Join us</Link></Button>
            </div>
          </aside>
        </div>
      </section>
      <section className="section border-t bg-surface">
        <div className="container-page">
          <h2 className="mb-6 text-2xl">Areas of activity</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AREAS.map(({ t, I }) => (
              <div key={t} className="flex items-center gap-3 rounded-md border bg-card p-4"><I className="h-5 w-5 text-brand-light" aria-hidden /><span className="text-sm font-medium">{t}</span></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

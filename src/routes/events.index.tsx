import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Empty, EventCard, PageHeader } from "@/components/site/ui";
import { listQuery } from "@/lib/queries";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Events — SSIRC" },
      { name: "description", content: "Upcoming and past workshops, competitions and exhibitions by SSIRC." },
      { property: "og:title", content: "Events — SSIRC" },
      { property: "og:description", content: "Workshops, competitions and exhibitions by SSIRC." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(listQuery({ table: "events" })),
  component: Events,
});

function Events() {
  const { data } = useSuspenseQuery(listQuery({ table: "events" }));
  const [tab, setTab] = useState("upcoming");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const now = Date.now();
    const f = data.filter((e) => (tab === "upcoming" ? new Date(e.starts_at).getTime() >= now : new Date(e.starts_at).getTime() < now) && e.title.toLowerCase().includes(q.toLowerCase()));
    return tab === "past" ? f.reverse() : f;
  }, [data, tab, q]);
  return (
    <>
      <PageHeader eyebrow="Calendar" title="Events" intro="Workshops, competitions, exhibitions and club meetings." />
      <div className="container-page section">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Tabs value={tab} onValueChange={setTab}><TabsList><TabsTrigger value="upcoming">Upcoming</TabsTrigger><TabsTrigger value="past">Past</TabsTrigger></TabsList></Tabs>
          <Input placeholder="Search events" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search events" className="sm:max-w-sm" />
        </div>
        {list.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((e) => <EventCard key={e.id} e={e} />)}</div> : <Empty>No {tab} events.</Empty>}
      </div>
    </>
  );
}

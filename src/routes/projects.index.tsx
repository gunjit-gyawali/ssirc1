import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Empty, PageHeader, ProjectCard } from "@/components/site/ui";
import { FilterSelect } from "@/components/site/FilterSelect";
import { listQuery } from "@/lib/queries";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/lib/constants";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — SSIRC" },
      { name: "description", content: "Robotics, software, electronics and science projects built by SSIRC members." },
      { property: "og:title", content: "Projects — SSIRC" },
      { property: "og:description", content: "Explore projects built by SSIRC members." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(listQuery({ table: "projects" })),
  component: Projects,
});

function Projects() {
  const { data } = useSuspenseQuery(listQuery({ table: "projects" }));
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [st, setSt] = useState("all");
  const list = useMemo(
    () => data.filter((p) => (cat === "all" || p.category === cat) && (st === "all" || p.status === st) && `${p.title} ${p.summary ?? ""}`.toLowerCase().includes(q.toLowerCase())),
    [data, q, cat, st],
  );
  return (
    <>
      <PageHeader eyebrow="Our work" title="Projects" intro="Hands-on work in robotics, software, electronics and research." />
      <div className="container-page section">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <Input placeholder="Search projects" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search projects" className="sm:max-w-sm" />
          <FilterSelect value={cat} onChange={setCat} options={PROJECT_CATEGORIES} label="Categories" />
          <FilterSelect value={st} onChange={setSt} options={PROJECT_STATUSES} label="Statuses" />
        </div>
        {list.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProjectCard key={p.id} p={p} />)}</div> : <Empty>No projects match your filters.</Empty>}
      </div>
    </>
  );
}

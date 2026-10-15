import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Empty, MemberCard, PageHeader } from "@/components/site/ui";
import { listQuery } from "@/lib/queries";
import { MEMBER_CATEGORIES } from "@/lib/constants";
import { FilterSelect } from "@/components/site/FilterSelect";

export const Route = createFileRoute("/members/")({
  head: () => ({
    meta: [
      { title: "Members — SSIRC" },
      { name: "description", content: "Directory of SSIRC members and their portfolios." },
      { property: "og:title", content: "Members — SSIRC" },
      { property: "og:description", content: "Browse member portfolios of SSIRC." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(listQuery({ table: "members" })),
  component: Members,
});

function Members() {
  const { data } = useSuspenseQuery(listQuery({ table: "members" }));
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const list = useMemo(
    () =>
      data.filter(
        (m) =>
          (cat === "all" || m.category === cat) &&
          `${m.full_name} ${m.designation ?? ""} ${(m.skills ?? []).join(" ")}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [data, q, cat],
  );
  return (
    <>
      <PageHeader eyebrow="Directory" title="Members" intro="Explore the portfolios of SSIRC members." />
      <div className="container-page section">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <Input placeholder="Search by name, role or skill" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search members" className="sm:max-w-sm" />
          <FilterSelect value={cat} onChange={setCat} options={MEMBER_CATEGORIES} label="Category" />
        </div>
        {list.length ? <div className="grid grid-cols-2 gap-5 md:grid-cols-4">{list.map((m) => <MemberCard key={m.id} m={m} />)}</div> : <Empty>No members match your search.</Empty>}
      </div>
    </>
  );
}

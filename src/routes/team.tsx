import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Empty, MemberCard, PageHeader } from "@/components/site/ui";
import { listQuery } from "@/lib/queries";
import { MEMBER_CATEGORIES } from "@/lib/constants";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "BOD & Team — SSIRC" },
      { name: "description", content: "Board of Directors, executive committee and teams of SSIRC." },
      { property: "og:title", content: "BOD & Team — SSIRC" },
      { property: "og:description", content: "Meet the people who lead and run SSIRC." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(listQuery({ table: "members" })),
  component: Team,
});

function Team() {
  const { data } = useSuspenseQuery(listQuery({ table: "members" }));
  const groups = MEMBER_CATEGORIES.filter((c) => c !== "General Members")
    .map((c) => ({ c, list: data.filter((m) => m.category === c) }))
    .filter((g) => g.list.length);
  return (
    <>
      <PageHeader eyebrow="Our people" title="Board of Directors & Team" intro="The students who lead SSIRC's activities, projects and events." />
      <div className="container-page section space-y-14">
        {groups.length ? groups.map((g) => (
          <section key={g.c}>
            <h2 className="mb-6 text-2xl">{g.c}</h2>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">{g.list.map((m) => <MemberCard key={m.id} m={m} />)}</div>
          </section>
        )) : <Empty>Team profiles will appear here once published by an administrator.</Empty>}
      </div>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { Award, Calendar, FolderKanban, Users, UserCheck, Mail, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";
import { CLUB, formatDate, listQuery, settingsQuery, statsQuery } from "@/lib/queries";
import { Empty, EventCard, Img, MemberCard, ProjectCard, SectionTitle, SocialLinks } from "@/components/site/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SSIRC — Shanti Science ICT and Robotics Club" },
      { name: "description", content: "Inspiring innovation through science, ICT and robotics. Projects, events, team and membership of SSIRC." },
      { property: "og:title", content: "SSIRC — Shanti Science ICT and Robotics Club" },
      { property: "og:description", content: "Inspiring innovation through science, ICT and robotics." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: Home,
});

const DEFAULT_ORDER = ["hero", "about", "stats", "bod", "projects", "events", "achievements", "spotlight", "gallery", "join", "contact"];

function Home() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const hp = settings.homepage ?? {};
  const order: string[] = Array.isArray(hp.sections) && hp.sections.length ? hp.sections : DEFAULT_ORDER;
  const hidden: string[] = Array.isArray(hp.hidden) ? hp.hidden : [];
  const map: any = {
    hero: () => <Hero g={settings.general ?? {}} />,
    about: () => <About a={settings.about ?? {}} />,
    stats: () => <Stats />,
    bod: () => <Bod />,
    projects: () => <Featured />,
    events: () => <Upcoming />,
    achievements: () => <Achievements />,
    spotlight: () => <Spotlight />,
    gallery: () => <GalleryPreview />,
    join: () => <JoinCta />,
    contact: () => <ContactPreview g={settings.general ?? {}} />,
  };
  return (
    <>
      {order.filter((k) => map[k] && !hidden.includes(k)).map((k) => (
        <div key={k}>{map[k]()}</div>
      ))}
    </>
  );
}

function Hero({ g }: { g: any }) {
  return (
    <section className="border-b bg-surface">
      <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="eyebrow mb-3">{CLUB.name} · {CLUB.short}</p>
          <h1 className="text-3xl leading-tight md:text-[2.6rem]">{g.tagline || "Inspiring Innovation Through Science, ICT and Robotics"}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{g.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/projects">Explore Our Projects</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/team">Meet Our Team</Link></Button>
          </div>
        </div>
        <img src={g.hero_image || hero} alt="SSIRC students building a robot together" width={1536} height={1024} className="aspect-[3/2] w-full rounded-md border object-cover" />
      </div>
    </section>
  );
}

function About({ a }: { a: any }) {
  return (
    <section className="section">
      <div className="container-page grid gap-10 md:grid-cols-3">
        <div className="md:col-span-1">
          <p className="eyebrow mb-1.5">About SSIRC</p>
          <h2 className="text-2xl md:text-3xl">Who we are</h2>
          <p className="mt-4 text-muted-foreground">{a.introduction}</p>
          <Button asChild variant="link" className="mt-2 px-0"><Link to="/about">Read more <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
          <div className="rounded-md border p-6"><h3 className="text-lg">Mission</h3><p className="mt-2 text-sm text-muted-foreground">{a.mission}</p></div>
          <div className="rounded-md border p-6"><h3 className="text-lg">Vision</h3><p className="mt-2 text-sm text-muted-foreground">{a.vision}</p></div>
          {Array.isArray(a.objectives) && (
            <div className="rounded-md border p-6 sm:col-span-2">
              <h3 className="text-lg">Core objectives</h3>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {a.objectives.map((o: string) => <li key={o} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-light" />{o}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const { data } = useQuery(statsQuery);
  const items = [
    { label: "Members", v: data?.members, Icon: Users },
    { label: "BOD members", v: data?.bod, Icon: UserCheck },
    { label: "Projects completed", v: data?.projects, Icon: FolderKanban },
    { label: "Events conducted", v: data?.events, Icon: Calendar },
    { label: "Achievements", v: data?.awards, Icon: Award },
  ];
  return (
    <section className="border-y bg-brand text-primary-foreground">
      <div className="container-page grid grid-cols-2 gap-6 py-10 md:grid-cols-5">
        {items.map(({ label, v, Icon }) => (
          <div key={label} className="text-center">
            <Icon className="mx-auto mb-2 h-5 w-5 opacity-80" aria-hidden />
            <p className="text-3xl font-bold">{v ?? "–"}</p>
            <p className="text-sm opacity-80">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Bod() {
  const { data = [] } = useQuery(listQuery({ table: "members" }));
  const bod = data.filter((m) => m.category === "Board of Directors").slice(0, 8);
  return (
    <section className="section">
      <div className="container-page">
        <SectionTitle eyebrow="Leadership" title="Board of Directors" action={<Button asChild variant="outline"><Link to="/team">Full team</Link></Button>} />
        {bod.length ? <div className="grid grid-cols-2 gap-5 md:grid-cols-4">{bod.map((m) => <MemberCard key={m.id} m={m} />)}</div> : <Empty>Board of Directors profiles will appear here once published.</Empty>}
      </div>
    </section>
  );
}

function Featured() {
  const { data = [] } = useQuery(listQuery({ table: "projects", featured: true, limit: 3 }));
  return (
    <section className="section bg-surface">
      <div className="container-page">
        <SectionTitle eyebrow="Our work" title="Featured projects" action={<Button asChild variant="outline"><Link to="/projects">All projects</Link></Button>} />
        {data.length ? <div className="grid gap-5 md:grid-cols-3">{data.map((p) => <ProjectCard key={p.id} p={p} />)}</div> : <Empty />}
      </div>
    </section>
  );
}

function Upcoming() {
  const { data = [] } = useQuery(listQuery({ table: "events", upcoming: true, limit: 3 }));
  return (
    <section className="section">
      <div className="container-page">
        <SectionTitle eyebrow="Calendar" title="Upcoming events" action={<Button asChild variant="outline"><Link to="/events">All events</Link></Button>} />
        {data.length ? <div className="grid gap-5 md:grid-cols-3">{data.map((e) => <EventCard key={e.id} e={e} />)}</div> : <Empty>No upcoming events right now.</Empty>}
      </div>
    </section>
  );
}

function Achievements() {
  const { data = [] } = useQuery(listQuery({ table: "achievements", limit: 4 }));
  return (
    <section className="section bg-surface">
      <div className="container-page">
        <SectionTitle eyebrow="Recognition" title="Achievements & news" action={<Button asChild variant="outline"><Link to="/news">Latest news</Link></Button>} />
        {data.length ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {data.map((a) => (
              <li key={a.id} className="flex gap-4 rounded-md border bg-card p-5">
                <Award className="h-6 w-6 shrink-0 text-brand-light" aria-hidden />
                <div><h3 className="text-base">{a.title}</h3><p className="text-sm text-muted-foreground">{[a.organization, formatDate(a.achieved_on)].filter(Boolean).join(" · ")}</p></div>
              </li>
            ))}
          </ul>
        ) : <Empty>Achievements will be listed here once added.</Empty>}
      </div>
    </section>
  );
}

function Spotlight() {
  const { data = [] } = useQuery(listQuery({ table: "members", featured: true, limit: 4 }));
  if (!data.length) return null;
  return (
    <section className="section">
      <div className="container-page">
        <SectionTitle eyebrow="Member spotlight" title="Meet our members" action={<Button asChild variant="outline"><Link to="/members">Directory</Link></Button>} />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">{data.map((m) => <MemberCard key={m.id} m={m} />)}</div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  const { data = [] } = useQuery(listQuery({ table: "gallery_images", limit: 8 }));
  if (!data.length) return null;
  return (
    <section className="section bg-surface">
      <div className="container-page">
        <SectionTitle eyebrow="Gallery" title="Club moments" action={<Button asChild variant="outline"><Link to="/gallery">View gallery</Link></Button>} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{data.map((g) => <Img key={g.id} src={g.image_url} alt={g.caption || "Club photo"} className="aspect-square w-full rounded-md" />)}</div>
      </div>
    </section>
  );
}

function JoinCta() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="grid gap-6 rounded-md border bg-accent p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <h2 className="text-2xl md:text-3xl">Join the club</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">Learn robotics, coding and electronics with peers, take part in competitions and exhibitions, and build projects that matter.</p>
          </div>
          <Button asChild size="lg"><Link to="/join">Apply for membership</Link></Button>
        </div>
      </div>
    </section>
  );
}

function ContactPreview({ g }: { g: any }) {
  return (
    <section className="section border-t">
      <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl">Get in touch</h2>
          {g.email && <p className="mt-2 flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{g.email}</p>}
          <SocialLinks links={g} />
        </div>
        <Button asChild variant="outline" size="lg"><Link to="/contact">Contact us</Link></Button>
      </div>
    </section>
  );
}

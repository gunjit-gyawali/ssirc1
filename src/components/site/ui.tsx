import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Github, Linkedin, Globe, Facebook, Instagram, Youtube, ImageIcon, User } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/queries";
import type { Row } from "@/lib/public.functions";

export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <section className="border-b bg-surface">
      <div className="container-page py-12 md:py-16">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-3xl md:text-4xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p>}
      </div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h2 className="text-2xl md:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Empty({ children = "Nothing published yet. Check back soon." }: { children?: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed bg-surface px-6 py-12 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function Img({ src, alt, className = "", icon = "image" }: { src?: string | null; alt: string; className?: string; icon?: "image" | "user" }) {
  if (!src) {
    const Icon = icon === "user" ? User : ImageIcon;
    return (
      <div className={`flex items-center justify-center bg-subtle text-muted-foreground ${className}`} aria-label={alt} role="img">
        <Icon className="h-8 w-8 opacity-50" />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}

export function MemberCard({ m }: { m: Row }) {
  return (
    <Link
      to="/members/$slug"
      params={{ slug: m.slug }}
      className="group block overflow-hidden rounded-md border bg-card transition-shadow hover:shadow-md"
    >
      <Img src={m.photo_url} alt={m.full_name} icon="user" className="aspect-[4/5] w-full" />
      <div className="p-4">
        <h3 className="text-base group-hover:underline">{m.full_name}</h3>
        {m.designation && <p className="text-sm text-brand-light">{m.designation}</p>}
        {m.short_bio && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{m.short_bio}</p>}
      </div>
    </Link>
  );
}

export function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  return <Badge variant="secondary">{status}</Badge>;
}

export function ProjectCard({ p }: { p: Row }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: p.slug }}
      className="group flex flex-col overflow-hidden rounded-md border bg-card transition-shadow hover:shadow-md"
    >
      <Img src={p.cover_url} alt={p.title} className="aspect-video w-full" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap gap-2">
          <Badge variant="outline">{p.category}</Badge>
          <StatusBadge status={p.status} />
        </div>
        <h3 className="text-lg group-hover:underline">{p.title}</h3>
        {p.summary && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.summary}</p>}
        <span className="mt-auto pt-4 text-sm font-medium text-brand">View project →</span>
      </div>
    </Link>
  );
}

export function EventCard({ e }: { e: Row }) {
  return (
    <Link
      to="/events/$slug"
      params={{ slug: e.slug }}
      className="group flex flex-col overflow-hidden rounded-md border bg-card transition-shadow hover:shadow-md"
    >
      <Img src={e.poster_url} alt={e.title} className="aspect-video w-full" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        {e.category && <Badge variant="outline" className="w-fit">{e.category}</Badge>}
        <h3 className="text-lg group-hover:underline">{e.title}</h3>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" aria-hidden /> {formatDate(e.starts_at, true)}
        </p>
        {e.venue && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden /> {e.venue}
          </p>
        )}
      </div>
    </Link>
  );
}

export function SocialLinks({ links }: { links: Row }) {
  const items = [
    { k: "github_url", alt: "github", Icon: Github, label: "GitHub" },
    { k: "linkedin_url", alt: "linkedin", Icon: Linkedin, label: "LinkedIn" },
    { k: "website_url", alt: "website", Icon: Globe, label: "Website" },
    { k: "facebook", alt: "facebook", Icon: Facebook, label: "Facebook" },
    { k: "instagram", alt: "instagram", Icon: Instagram, label: "Instagram" },
    { k: "youtube", alt: "youtube", Icon: Youtube, label: "YouTube" },
  ];
  const shown = items
    .map((i) => ({ ...i, url: links[i.k] || links[i.alt] }))
    .filter((i) => typeof i.url === "string" && /^https?:\/\//.test(i.url));
  if (!shown.length) return null;
  return (
    <div className="flex gap-2 pt-1">
      {shown.map(({ url, Icon, label }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground hover:border-brand hover:text-brand"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}

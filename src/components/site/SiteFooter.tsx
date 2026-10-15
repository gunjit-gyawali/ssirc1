import { Link, useLoaderData } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { CLUB } from "@/lib/queries";
import { Logo, NAV } from "./SiteHeader";
import { SocialLinks } from "./ui";

export function SiteFooter() {
  const data = useLoaderData({ from: "__root__" }) as any;
  const g: any = data?.general ?? {};
  return (
    <footer className="border-t bg-surface">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            {CLUB.name} — a student community for science, ICT, robotics, programming and research.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Quick links</h2>
          <ul className="grid grid-cols-2 gap-1.5 text-sm">
            {[...NAV, { to: "/news", label: "News" } as const, { to: "/join", label: "Join Us" } as const].map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-muted-foreground hover:text-brand">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 text-sm">
          <h2 className="mb-3 text-sm font-semibold">Contact</h2>
          {g.email && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" aria-hidden /> {g.email}
            </p>
          )}
          {g.location && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden /> {g.location}
            </p>
          )}
          <SocialLinks links={g} />
        </div>
      </div>
      <div className="border-t">
        <div className="container-page flex flex-col justify-between gap-2 py-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {CLUB.name}. All rights reserved.</p>
          <Link to="/admin" className="hover:text-brand">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

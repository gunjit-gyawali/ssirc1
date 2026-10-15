import { Link } from "@tanstack/react-router";
import { Menu, X, Cpu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/team", label: "BOD & Team" },
  { to: "/members", label: "Members" },
  { to: "/projects", label: "Projects" },
  { to: "/events", label: "Events" },
  { to: "/achievements", label: "Achievements" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="SSIRC home">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-primary-foreground">
        <Cpu className="h-5 w-5" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block text-base font-bold text-brand">SSIRC</span>
        <span className="hidden text-xs text-muted-foreground sm:block">Science · ICT · Robotics</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-sm px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-brand data-[status=active]:text-brand data-[status=active]:underline data-[status=active]:decoration-2 data-[status=active]:underline-offset-[22px]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/join">Join Us</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="border-t bg-background lg:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col py-2">
            {[...NAV, { to: "/join", label: "Join Us" } as const].map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-sm px-2 py-2.5 text-sm font-medium data-[status=active]:bg-accent data-[status=active]:text-brand"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

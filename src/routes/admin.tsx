import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LayoutDashboard, Home, Info, Users, FolderKanban, Calendar, Award, Newspaper, Images, ClipboardList, Mail, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — SSIRC" }, { name: "robots", content: "noindex, nofollow" }] }),
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/admin/login", search: { redirect: location.pathname } });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
    return { user: data.user, isAdmin: !!isAdmin };
  },
  component: AdminLayout,
});

const LINKS = [
  { to: "/admin", label: "Dashboard", I: LayoutDashboard },
  { to: "/admin/homepage", label: "Homepage", I: Home },
  { to: "/admin/about", label: "About page", I: Info },
  { to: "/admin/members", label: "Members & BOD", I: Users },
  { to: "/admin/projects", label: "Projects", I: FolderKanban },
  { to: "/admin/events", label: "Events", I: Calendar },
  { to: "/admin/achievements", label: "Achievements", I: Award },
  { to: "/admin/news", label: "News", I: Newspaper },
  { to: "/admin/gallery", label: "Gallery", I: Images },
  { to: "/admin/applications", label: "Applications", I: ClipboardList },
  { to: "/admin/messages", label: "Messages", I: Mail },
  { to: "/admin/settings", label: "Settings", I: Settings },
] as const;

function AdminLayout() {
  const { user, isAdmin } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", search: { redirect: undefined }, replace: true });
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-4">
        <div className="max-w-md rounded-md border bg-card p-8 text-center">
          <h1 className="text-xl">Access restricted</h1>
          <p className="mt-2 text-sm text-muted-foreground">Signed in as {user.email}. This account does not have administrator access. Ask an existing administrator to grant it.</p>
          <div className="mt-6 flex justify-center gap-2"><Button variant="outline" asChild><Link to="/">Back to site</Link></Button><Button onClick={signOut}>Sign out</Button></div>
        </div>
      </div>
    );
  }

  const nav = (
    <nav className="flex flex-col gap-0.5" aria-label="Admin">
      {LINKS.map(({ to, label, I }) => (
        <Link key={to} to={to} onClick={() => setOpen(false)} activeOptions={{ exact: to === "/admin" }} className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent data-[status=active]:bg-accent data-[status=active]:font-medium data-[status=active]:text-brand">
          <I className="h-4 w-4" />{label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu"><Menu /></Button>
          <Logo /><span className="hidden text-sm text-muted-foreground sm:inline">Admin</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-muted-foreground sm:inline">{user.email}</span>
          <Button variant="outline" size="sm" asChild><a href="/" target="_blank" rel="noreferrer">View site</a></Button>
          <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</Button>
        </div>
      </header>
      <div className="flex">
        <aside className={`${open ? "block" : "hidden"} fixed inset-y-14 left-0 z-20 w-60 border-r bg-background p-3 md:sticky md:top-14 md:block md:h-[calc(100vh-3.5rem)]`}>{nav}</aside>
        <main className="min-w-0 flex-1 p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

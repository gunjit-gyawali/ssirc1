import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const TABLES = ["members", "projects", "events", "achievements", "news", "gallery_images"] as const;
type PublicTable = (typeof TABLES)[number];
const ORDER: Record<PublicTable, { col: string; asc: boolean }> = {
  members: { col: "display_order", asc: true },
  projects: { col: "created_at", asc: false },
  events: { col: "starts_at", asc: true },
  achievements: { col: "achieved_on", asc: false },
  news: { col: "published_at", asc: false },
  gallery_images: { col: "display_order", asc: true },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Row = any;

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().from("site_settings").select("key,value");
  if (error) console.error(error);
  const map: Record<string, any> = {};
  for (const r of data ?? []) map[r.key] = (r.value ?? {}) as Row;
  return map as { general?: any; about?: any; homepage?: any };
});

export const listPublic = createServerFn({ method: "GET" })
  .inputValidator((d: { table: PublicTable; featured?: boolean; limit?: number; upcoming?: boolean }) => {
    if (!TABLES.includes(d.table)) throw new Error("Invalid table");
    return d;
  })
  .handler(async ({ data }) => {
    const o = ORDER[data.table];
    let q = (publicClient().from(data.table) as any).select("*").eq("published", true);
    if (data.featured) q = q.eq("featured", true);
    if (data.upcoming) q = q.gte("starts_at", new Date().toISOString());
    q = q.order(o.col, { ascending: o.asc, nullsFirst: false });
    if (data.limit) q = q.limit(data.limit);
    const { data: rows, error } = await q;
    if (error) {
      console.error(error);
      return [] as Row[];
    }
    return (rows ?? []) as Row[];
  });

export const getBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { table: "members" | "projects" | "events" | "news"; slug: string }) => {
    if (!["members", "projects", "events", "news"].includes(d.table)) throw new Error("Invalid table");
    return { table: d.table, slug: String(d.slug).slice(0, 200) };
  })
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: row } = await (sb.from(data.table) as any)
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!row) return { row: null as Row | null, related: [] as Row[] };
    let related: Row[] = [];
    if (data.table === "projects") {
      const { data: pm } = await sb.from("project_members").select("member_id").eq("project_id", row.id);
      const ids = (pm ?? []).map((x) => x.member_id!);
      if (ids.length) {
        const { data: m } = await sb.from("members").select("*").in("id", ids).eq("published", true);
        related = m ?? [];
      }
    } else if (data.table === "members") {
      const { data: pm } = await sb.from("project_members").select("project_id").eq("member_id", row.id);
      const ids = (pm ?? []).map((x) => x.project_id!);
      if (ids.length) {
        const { data: p } = await sb.from("projects").select("*").in("id", ids).eq("published", true);
        related = p ?? [];
      }
    }
    return { row: row as Row, related };
  });

export const getStats = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const count = async (t: PublicTable, f?: (q: any) => any) => {
    let q = (sb.from(t) as any).select("id", { count: "exact", head: true }).eq("published", true);
    if (f) q = f(q);
    const { count } = await q;
    return count ?? 0;
  };
  const [members, bod, projects, events, awards] = await Promise.all([
    count("members"),
    count("members", (q) => q.eq("category", "Board of Directors")),
    count("projects", (q) => q.eq("status", "Completed")),
    count("events", (q) => q.lt("starts_at", new Date().toISOString())),
    count("achievements"),
  ]);
  return { members, bod, projects, events, awards };
});

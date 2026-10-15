import { queryOptions } from "@tanstack/react-query";
import { getBySlug, getSettings, getStats, listPublic } from "./public.functions";

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: () => getSettings(),
  staleTime: 60_000,
});

type ListArgs = Parameters<typeof listPublic>[0]["data"];
export const listQuery = (args: ListArgs) =>
  queryOptions({ queryKey: ["list", args], queryFn: () => listPublic({ data: args }), staleTime: 30_000 });

type SlugArgs = Parameters<typeof getBySlug>[0]["data"];
export const slugQuery = (args: SlugArgs) =>
  queryOptions({ queryKey: ["slug", args], queryFn: () => getBySlug({ data: args }), staleTime: 30_000 });

export const statsQuery = queryOptions({ queryKey: ["stats"], queryFn: () => getStats(), staleTime: 60_000 });

export const CLUB = {
  name: "Shanti Science ICT and Robotics Club",
  short: "SSIRC",
};

export function formatDate(d?: string | null, withTime = false) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

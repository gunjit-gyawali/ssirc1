/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload, deleteImage } from "./ImageUpload";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "slug" | "select" | "bool" | "number" | "date" | "datetime" | "image" | "tags" | "url" | "email";
  options?: string[];
  required?: boolean;
  from?: string; // for slug
  help?: string;
};

export type Column = { key: string; label: string; render?: (r: any) => ReactNode };

export function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

const PAGE = 20;

export function AdminCrud({
  table, title, fields, columns, searchKeys, orderBy = "created_at", ascending = false, defaults = {}, previewPath, extraEditor, filterField, canCreate = true,
}: {
  table: string; title: string; fields: Field[]; columns: Column[]; searchKeys: string[]; orderBy?: string; ascending?: boolean;
  defaults?: Record<string, any>; previewPath?: (r: any) => string | null; filterField?: { name: string; options: string[] };
  extraEditor?: (row: any, setRow: (r: any) => void) => ReactNode; canCreate?: boolean;
}) {
  const qc = useQueryClient();
  const key = ["admin", table];
  const { data = [], isLoading, error } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await (supabase.from(table as any) as any).select("*").order(orderBy, { ascending });
      if (error) throw error;
      return data as any[];
    },
  });
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleting, setDeleting] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () => data.filter((r) => (filter === "all" || r[filterField!.name] === filter) && searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q.toLowerCase()))),
    [data, q, filter, searchKeys, filterField],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice(page * PAGE, page * PAGE + PAGE);

  function open(r?: any) {
    const blank: any = { ...defaults };
    fields.forEach((f) => { if (blank[f.name] === undefined) blank[f.name] = f.type === "bool" ? false : f.type === "tags" ? [] : ""; });
    setEditing(r ? { ...r } : blank);
  }

  async function save() {
    for (const f of fields) {
      if (f.required && (editing[f.name] === "" || editing[f.name] == null)) { toast.error(`${f.label} is required`); return; }
    }
    const payload: any = {};
    for (const f of fields) {
      let v = editing[f.name];
      if (f.type === "slug") v = slugify(v || editing[f.from ?? "title"] || "");
      if (["date", "datetime", "url", "email", "image", "select", "textarea", "text"].includes(f.type) && v === "") v = null;
      if (f.type === "datetime" && v) v = new Date(v).toISOString();
      if (f.type === "number") v = Number(v) || 0;
      if ((f.type === "url") && v && !/^https?:\/\//.test(v)) { toast.error(`${f.label} must start with http:// or https://`); return; }
      payload[f.name] = v;
    }
    setSaving(true);
    const base = supabase.from(table as any) as any;
    const res = editing.id ? await base.update(payload).eq("id", editing.id).select().single() : await base.insert(payload).select().single();
    setSaving(false);
    if (res.error) { toast.error(res.error.message.includes("duplicate") ? "That slug is already in use." : res.error.message); return; }
    if (editing.__after) await editing.__after(res.data.id);
    toast.success(editing.id ? "Saved" : "Created");
    setEditing(null);
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: ["list"] });
    qc.invalidateQueries({ queryKey: ["slug"] });
  }

  async function remove() {
    const r = deleting;
    const { error } = await (supabase.from(table as any) as any).delete().eq("id", r.id);
    setDeleting(null);
    if (error) { toast.error(error.message); return; }
    fields.filter((f) => f.type === "image").forEach((f) => deleteImage(r[f.name]));
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: key });
  }

  async function togglePublish(r: any) {
    const { error } = await (supabase.from(table as any) as any).update({ published: !r.published }).eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success(!r.published ? "Published" : "Unpublished");
    qc.invalidateQueries({ queryKey: key });
  }

  const hasPublish = fields.some((f) => f.name === "published");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl">{title}</h1>
        {canCreate && <Button onClick={() => open()}><Plus className="h-4 w-4" /> Add new</Button>}
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search…" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} className="sm:max-w-xs" aria-label="Search" />
        {filterField && (
          <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(0); }}>
            <SelectTrigger className="sm:w-52"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All</SelectItem>{filterField.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        )}
        {(q || filter !== "all") && <Button variant="ghost" onClick={() => { setQ(""); setFilter("all"); }}>Reset</Button>}
      </div>
      <div className="overflow-x-auto rounded-md border bg-card">
        <Table>
          <TableHeader><TableRow>{columns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}{hasPublish && <TableHead>Published</TableHead>}<TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={columns.length + 2} className="py-8 text-center text-muted-foreground">Loading…</TableCell></TableRow>}
            {error && <TableRow><TableCell colSpan={columns.length + 2} className="py-8 text-center text-destructive">{(error as Error).message}</TableCell></TableRow>}
            {!isLoading && !rows.length && <TableRow><TableCell colSpan={columns.length + 2} className="py-8 text-center text-muted-foreground">No records found.</TableCell></TableRow>}
            {rows.map((r) => (
              <TableRow key={r.id}>
                {columns.map((c) => <TableCell key={c.key} className="max-w-xs truncate">{c.render ? c.render(r) : String(r[c.key] ?? "")}</TableCell>)}
                {hasPublish && <TableCell><Switch checked={r.published} onCheckedChange={() => togglePublish(r)} aria-label="Toggle published" /></TableCell>}
                <TableCell className="whitespace-nowrap text-right">
                  {previewPath?.(r) && <Button variant="ghost" size="icon" asChild aria-label="Preview"><a href={previewPath(r)!} target="_blank" rel="noreferrer"><Eye className="h-4 w-4" /></a></Button>}
                  <Button variant="ghost" size="icon" onClick={() => open(r)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleting(r)} aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
          <span>Page {page + 1} of {pages}</span>
          <Button variant="outline" size="sm" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader><SheetTitle>{editing?.id ? "Edit" : "Add"} — {title}</SheetTitle></SheetHeader>
          {editing && (
            <div className="space-y-4 p-4">
              {fields.map((f) => <FieldInput key={f.name} f={f} value={editing[f.name]} folder={table} onChange={(v) => setEditing((e: any) => ({ ...e, [f.name]: v }))} />)}
              {extraEditor?.(editing, setEditing)}
              <div className="flex gap-2 pt-2">
                <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this record?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={remove}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function toLocalInput(v?: string) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

function FieldInput({ f, value, onChange, folder }: { f: Field; value: any; onChange: (v: any) => void; folder: string }) {
  const id = `f-${f.name}`;
  const label = <Label htmlFor={id}>{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>;
  let input: ReactNode;
  switch (f.type) {
    case "textarea": input = <Textarea id={id} rows={5} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />; break;
    case "bool": return <div className="flex items-center justify-between rounded-md border p-3">{label}<Switch id={id} checked={!!value} onCheckedChange={onChange} /></div>;
    case "select": input = (
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger id={id}><SelectValue placeholder="Select…" /></SelectTrigger>
        <SelectContent>{f.options!.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    ); break;
    case "image": input = <ImageUpload value={value} onChange={onChange} folder={folder} />; break;
    case "tags": input = <Input id={id} value={(value ?? []).join(", ")} onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Comma separated" />; break;
    case "number": input = <Input id={id} type="number" value={value ?? 0} onChange={(e) => onChange(e.target.value)} />; break;
    case "date": input = <Input id={id} type="date" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />; break;
    case "datetime": input = <Input id={id} type="datetime-local" value={toLocalInput(value)} onChange={(e) => onChange(e.target.value)} />; break;
    case "slug": input = <Input id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="Leave empty to generate from title" />; break;
    default: input = <Input id={id} type={f.type === "email" ? "email" : f.type === "url" ? "url" : "text"} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
  return <div className="space-y-1.5">{label}{input}{f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}</div>;
}

export function PubBadge({ on, label }: { on: boolean; label: string }) {
  return on ? <Badge variant="secondary">{label}</Badge> : null;
}

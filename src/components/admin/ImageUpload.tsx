import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

const MAX = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MEDIA_PREFIX = "/api/public/media/";

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!TYPES.includes(file.type)) throw new Error("Only JPG, PNG, WebP or GIF images are allowed.");
  if (file.size > MAX) throw new Error("Image must be 5 MB or smaller.");
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return MEDIA_PREFIX + path;
}

export async function deleteImage(url?: string | null) {
  if (url?.startsWith(MEDIA_PREFIX)) await supabase.storage.from("media").remove([url.slice(MEDIA_PREFIX.length)]);
}

export function ImageUpload({ value, onChange, folder }: { value?: string | null; onChange: (v: string | null) => void; folder: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  async function pick(f?: File) {
    if (!f) return;
    setProgress(20);
    const t = setInterval(() => setProgress((p) => (p && p < 90 ? p + 10 : p)), 200);
    try {
      const url = await uploadImage(f, folder);
      const old = value;
      onChange(url);
      if (old) deleteImage(old);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      clearInterval(t);
      setProgress(null);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-fit">
          <img src={value} alt="Preview" className="h-32 rounded-md border object-cover" />
          <Button type="button" size="icon" variant="destructive" className="absolute -right-2 -top-2 h-6 w-6" aria-label="Remove image" onClick={() => { deleteImage(value); onChange(null); }}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      <input ref={ref} type="file" accept={TYPES.join(",")} className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      <Button type="button" variant="outline" size="sm" onClick={() => ref.current?.click()} disabled={progress !== null}>
        <Upload className="h-4 w-4" /> {value ? "Replace image" : "Upload image"}
      </Button>
      {progress !== null && <Progress value={progress} className="h-1.5 w-48" />}
      <p className="text-xs text-muted-foreground">JPG, PNG, WebP or GIF · max 5 MB</p>
    </div>
  );
}

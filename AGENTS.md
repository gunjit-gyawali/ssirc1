<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Public pages read data through server functions in `src/lib/public.functions.ts` (publishable client, RLS `published = true`) so SSR/SEO works.
- Admin pages (`/admin/*`, `ssr: false`) write via the browser client; RLS `has_role(auth.uid(),'admin')` is the security boundary.
- Media lives in the private `media` bucket and is served via `/api/public/media/*` because the workspace blocks public buckets.
- The first account created becomes admin (DB trigger); further admins are granted via `user_roles`.
- Admin CRUD screens are config-driven through `src/components/admin/AdminCrud.tsx`; add fields there rather than custom forms.

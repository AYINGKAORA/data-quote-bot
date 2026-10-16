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

- Shared bilingual navigation uses AyingShell and LanguageProvider; keep language state consistent across content routes.
- Quote extraction uses a server function and streaming AI Responses in server-only helpers to keep credentials private.
- Generate Excel in the browser from recognized data; preserve source totals and do not invent missing numeric values.
- Keep active quotes in an owner-scoped shared context and persist every successful extraction in Cloud quote_records; this isolates accounts and provides automatic history.
- AccountProvider owns the only auth-state subscriber and account refresh; protected routes use the pathless authenticated layout and server actions independently enforce approval through RLS.
- Store account approval separately from profiles and roles; only verified designated administrators receive admin roles through the auth lifecycle trigger.
- Compute arithmetic review warnings without changing source numbers; missing numeric fields must never produce fabricated mismatches.

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
- Keep active quotes in the shared workspace context with session storage, and explicitly saved history in browser local storage; this preserves the upload/result/history flow without uploading history or adding accounts.
- Compute arithmetic review warnings without changing source numbers; missing numeric fields must never produce fabricated mismatches.

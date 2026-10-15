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

## Architecture
- Use React, Vite, React Router and TypeScript, following the user's explicit router migration request. Keep deep links working through the hosting provider's SPA fallback.
- Store illustrative recruitment data in a client-safe data module and use a shared in-memory demo provider for saved jobs; this separates frontend prototypes from production authentication and persistence.
- Use global semantic tokens and the shared HotelHire layout for public surfaces; this keeps the recruitment experience visually consistent.

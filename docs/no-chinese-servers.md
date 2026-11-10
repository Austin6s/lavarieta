# No Chinese servers: La Varieta (audit of 2026-11-07)

**Verdict:** this site has no server of its own and stores nothing. The chatbot (`chatbot.js`) is a
built-in FAQ: its own comment and the code agree that it makes no network request, and no AI is
involved. The lead form opens a pre-filled email (`mailto:`, or a Gmail or Outlook compose link) to
lavarietataiwan@gmail.com, and WhatsApp links open wa.me.

| Part | Where it runs | Evidence | Status |
|---|---|---|---|
| Hosting | GitHub Pages (Fastly CDN) | `CNAME` file; `server: GitHub.com`; from HiNet in Keelung, `x-served-by: cache-sin-…` (Singapore) | Fine; Fastly also has a Hong Kong location |
| DNS | Namecheap | README | Fine |
| Fonts | Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) | `index.html` lines 6–8; from Keelung they resolve to Google in Changhua, Taiwan | Not Chinese. Each visit tells Google the visitor's IP; self-hosting the two fonts removes that |
| Chatbot | In the page, no requests | `chatbot.js` | Fine |
| Form, email, WhatsApp | The visitor's own mail app, Gmail, Outlook or WhatsApp | `script.js` | Fine; no server of ours sees the brief |

**Deploy guard:** none needed; there is no data store. The rule is in `CLAUDE.md`.
**Note:** with `.nojekyll`, GitHub Pages serves every file in the repo, so committing `CLAUDE.md` and
this file publishes them at lavarietasourcing.com. They hold nothing private, but you may prefer to
keep them out of the repo.
**Optional:** self-host Cormorant Garamond and Karla instead of loading them from Google.

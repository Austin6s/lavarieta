# La Varieta — lavarietasourcing.com

Marketing homepage for **La Varieta Enterprise Co., Ltd.**, a family-owned,
founder-led Taiwan sourcing business (Pierre Zeidan). Static site — plain HTML,
CSS, and a small vanilla-JS lead form that opens a pre-filled email to Pierre.

Implemented from the Claude Design project *“La Varieta founder-led sourcing
website”* (`La Varieta Homepage.dc.html`, snapshot in [`design/`](design/)).

## Structure

- `index.html` — the whole page (design uses inline styles by intent; shared
  hover/responsive rules live in the `<style>` block in `<head>`)
- `script.js` — lead-capture form → `mailto:` brief + confirmation card
- `uploads/` — image assets (logo, Pierre headshot, category card photos)
- `logo.png` — root copy used as the `og:image`
- `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml` — GitHub Pages / SEO plumbing

## Hosting — GitHub Pages + Namecheap

Deployed via GitHub Pages from the `main` branch (root). The `CNAME` file pins
the custom domain `lavarietasourcing.com`.

DNS at Namecheap (Advanced DNS):

| Type  | Host | Value                  |
|-------|------|------------------------|
| A     | @    | 185.199.108.153        |
| A     | @    | 185.199.109.153        |
| A     | @    | 185.199.110.153        |
| A     | @    | 185.199.111.153        |
| CNAME | www  | austin6s.github.io.    |

After DNS propagates, enable **Enforce HTTPS** in the repo's
Settings → Pages (GitHub provisions the certificate automatically).

No build step: edit, commit, push to `main`, and Pages redeploys.

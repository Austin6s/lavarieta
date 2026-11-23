# La Varieta (lavarietasourcing.com): project rules

A static site (plain HTML, CSS and JS) published from the repo root by GitHub Pages; DNS at Namecheap. `README.md` has the structure and the hosting details.

- There is no dev branch: a push to `main` is the live site within minutes, so it needs the owner's yes.
- With `.nojekyll`, every file in the repo is served, this one included, so keep the repo free of anything private.

## No Chinese technology

The owner's highest-priority rule; his shared rules hold the full text. Nothing of this project may be stored on, processed by or sent through a server in mainland China, Hong Kong or Macau, and no AI model, service, library or tool made, controlled or started by a company based there may be used, wherever it is hosted. Before adding a host, region, CDN, font, dependency, AI provider or data store, find out who makes it and where it runs, and say so.

The site has no data store, so there is no deploy guard. The audit is in `docs/no-chinese-servers.md`.

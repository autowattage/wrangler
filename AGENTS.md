# AGENTS.md

Static hand-written site for the Hack Club "Wrangler" YSWS program. No package.json, no build step, no tests, no linters, no CI. HTML/CSS/JS only; content is authored directly in the markup.

## Commands

There is nothing to build or run. To preview, serve the repo root (paths are root-relative, so opening files directly breaks):

```
python3 -m http.server 8000
```

Deploy = push to `main` (remote: `git@github.com:autowattage/wrangler.git`). Match the existing informal commit-message style.

## Layout

- `index.html` — landing page (root)
- `/docs/` — docs pages: `index.html` (Overview), `time.html`, `krita.html`, `blender.html`, `aseprite.html`. Each is `index.html` at the repo root of its own dir: `/now/`, `/shop/`.
- `css/` — one stylesheet per page/section: `global.css` (shared), `index.css`, `docs.css`, `shop.css`, `now.css`
- `js/` — `docs.js` (menu toggle), `landing.js` (responsive `<details>` autoclose); shop/now pages have no JS
- `img/` — shared art; `img/docs/krita/`, `img/shop/`, `img/now/` per-section
- `-old` files (`index-old.css`, `te-slider-old.js`, `favicon-old.png`, `css/index-old.css`) are legacy dead code — don't reference them

## Gotchas

- **All asset URLs are absolute** (`/css/...`, `/img/...`, `/favicon.png`). Keep them root-relative; serve from the repo root.
- **Two different `favicon.png` files**: root `/favicon.png` (used as site favicon and docs-home link) vs `/img/favicon.png` (docs sidebar, swaps to `favicon-yellow.png`/`favicon-red.png` on hover/click). Don't "fix" this — it's intentional.
- **Docs pages share a hand-copied template**: `nav#menu` sidebar (with `ul style="display:none;"`), `nav#pagemenu` TOC, breadcrumb (`Home > Docs > ...`), prev/next `<footer>` links, and `<script src="/js/docs.js">`. When adding a doc page, replicate the whole template and update the menu `ul` on **every** doc page.
- **CSS uses native CSS nesting** (`&`, top-level `>` selectors) in `global.css`, `index.css`, `shop.css`, `docs.css` — requires a modern browser (Chrome 112+, Safari 16.5+, Firefox 117+). No preprocessor.
- **Colors come from CSS variables** in `:root` of `global.css` (`--red`, `--blue`, `--yellow`, etc.). Reuse them; don't hardcode hex.
- **`/shop/` is WIP**: every product currently uses a placeholder image (`prismacolors.png` or `aseprite.png`) regardless of product; hour-costs are plain `<button>` text. Don't assume real images exist.
- **`/now/` posts**: newest entry at top, images named `MMDDYYYYHHMM.png`, list them as `summary`-timestamped `<details>`.
- Loose markup throughout (e.g. `<img ...></img>`, missing `type="button"`) is intentional. Don't mass-format or "clean up" the HTML.

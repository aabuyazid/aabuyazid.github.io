# Arkan T. Abuyazid — Portfolio

A three.js portfolio built as a single warm-lit workbench. Each object on the
desk is a station: scrolling flies the camera along the bench, and clicking an
object (or a nav dot) opens its content panel.

Live at <https://aabuyazid.github.io>.

## Running it

```bash
npm install
npm run dev      # dev server
npm run build    # production build into dist/
npm run preview  # serve the built site
```

## How it fits together

| Path | What it holds |
|---|---|
| `src/data/content.js` | **All** text, links and asset paths. Edit the site here. |
| `src/main.js` | Bootstrap, render loop, scroll driving, deep links, no-WebGL fallback. |
| `src/scene/world.js` | Desk, wall, lighting, station layout (`LAYOUT`). |
| `src/scene/stations/` | One module per desk object. |
| `src/scene/screens.js` | The animated canvas textures (compression monitor, CV timeline). |
| `src/scene/textures.js` | Procedural wood grain for the desk. |
| `src/scene/post.js` | Depth of field, bloom, film grain and vignette. |
| `src/camera/path.js` | Camera rig: per-station poses, easing, panel offset. |
| `src/ui/` | Content panel, station nav, and the HTML renderer shared with the fallback. |

### Editing content

Everything visible comes from `src/data/content.js`. The `stations` array order
sets both the camera path order and the nav order. To move a station along the
bench or change what height the camera frames it at, edit `LAYOUT` in
`src/scene/world.js`.

### Accessibility and fallbacks

- The HTML panel is the source of truth for content; the 3D scene is presentation.
- Without WebGL the page renders every station as a plain readable document.
- `prefers-reduced-motion` disables the camera fly-through and idle drift.
- Panels are keyboard operable: Esc closes, Tab is trapped while open.
- Deep links work: `/#ccf`, `/#cv`, and so on.

## Deployment

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds and
publishes `dist/` to GitHub Pages. Pages must be set to the **GitHub Actions**
source in the repository settings.

## Assets

Project figures were converted to WebP and resized (about 29 MB of PNGs down to
~570 KB). PDFs are served as-is and only load when clicked. The previous Jekyll
site is preserved in git history.

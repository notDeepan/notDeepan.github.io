# Pixel Rice studio

An independent design and technology studio website, with three founder portraits, a five-project portfolio, food interludes, and animated rice particles.

Partner preview: https://notdeepan.github.io/pixel-rice/

## Develop

```sh
npm ci
npm run dev
npm test
npm run typecheck
```

Development runs on http://127.0.0.1:3000 and uses `.next-dev`. The normal Node deployment uses `npm run build` followed by `npm start`.

## GitHub Pages

The complete application source is in `pixel-rice-studio/` on the `main` branch of `notDeepan/notDeepan.github.io`. The exported preview is in `public/pixel-rice/`, so future builds of the parent portfolio preserve it. The existing `gh-pages` branch publishes the export from `pixel-rice/`.

```sh
npm run build:pages
node scripts/preview-pages.mjs
```

The Pages build records its output directory in `artifacts/pages-output.json`. Preview it at http://127.0.0.1:3002/pixel-rice/. For updates, copy the exported files into `main:public/pixel-rice/` and `gh-pages:pixel-rice/`, preserving the other portfolio files.

The isolated static build uses `/pixel-rice` as its base path and excludes the server-only contact route. Founder images, project media, fonts, scripts and the icon support this path.

## Content and contact

- `src/data/site.ts`: studio name, copy and founder roles.
- `src/data/projects.ts`: five featured projects and their live website links.
- `docs/ARTWORK.md`: founder artwork provenance.
- `docs/CONTENT_SOURCES.md`: portfolio sources and demo labels.
- `scripts/prepare-covers.mjs`: editable original cover artwork.

The CRM project is excluded. Project artwork and titles link to the live websites, with details available separately.

GitHub Pages contact offers a local text-file brief download and never claims delivery. For a future Node deployment, copy `.env.example` to `.env.local`, configure `RESEND_API_KEY`, `CONTACT_FROM` and `CONTACT_TO`, and verify the sender domain. Never commit credentials.

## Interaction and accessibility

Native scrolling drives one damping stage and one Three.js render loop. Food stays in world space while the camera descends. Clickable cover regions follow the artwork and preserve scrolling. Reduced motion and Simple view are supported; dialogs support keyboard access and Escape.

The partner preview remains `noindex`. Private source photographs and internal business records are not included.

Validation: 12 regression tests and the static production build pass. The exported preview was browser-checked for all five project destinations, founder images, final 05/05 navigation, and contact fallback.

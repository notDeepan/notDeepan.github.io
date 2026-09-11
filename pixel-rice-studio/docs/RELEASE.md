# Pixel Rice production release — 2026-09-11

The user approved publishing the immersive redesign and the original founder portraits embedded in the glass panels.

- Approved source: `077fa8b42f3618fc5bb3c5547466fa9fb00d7160`, merged from `feature/immersive-redesign` into main.
- Public address: https://notdeepan.github.io/pixel-rice/
- GitHub Pages source: `gh-pages`, repository root. Only its `pixel-rice/` subtree is updated for this release.
- Main retains the Next.js source in `pixel-rice-studio/` and the matching static export in `public/pixel-rice/` for future portfolio builds.
- Existing unrelated portfolio files and older hashed assets are preserved.
- Validation: all 12 existing tests; fresh static export with `/pixel-rice` base path and TypeScript validation. The approved preview was checked on desktop, mobile, reduced motion, project links and renderer recovery.
- Previous live commit for reference: `ba2069e19b384385e1b7656bc4608f2da9b3ee17`. Restore only the Pixel Rice subtree if rolling back; do not revert unrelated hosted content.

GitHub Pages does not run the server contact endpoint. The contact interface still saves a project brief until an inquiry inbox/service is configured.

## Approved refinement release — 2026-09-12

The user approved the cinematic refinement branch for main, with one final correction: give “Different ingredients” enough time to read. This release includes the reviewed visual changes through c3cd993 and a dedicated ingredients reading hold at story phase 0.52. The hold adds 1.05 viewport heights of native scroll on desktop and mobile. DOM text and 3D objects use the same held phase; later scenes retain their previous travel and speed. Work follows Vision directly.

Validation: 16 tests and a fresh static production export/typecheck pass. Desktop/mobile browser checks confirm the ingredients headline stays at full opacity across the added hold while Vision remains hidden and native scrolling advances normally. The full browser regression passed all five public project destinations, original portraits, mobile layouts, native wheel input, dialog Escape/focus restoration, Simple view renderer restoration and OS reduced motion, with no page/shader errors.

Publish the matching export to main's public/pixel-rice and the gh-pages pixel-rice subtree. Preserve unrelated portfolio content and older hashed assets. Previous production references are main 5be6fbe and gh-pages 2fbe1c4. The source contact-service limitation above remains unchanged.

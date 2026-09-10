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

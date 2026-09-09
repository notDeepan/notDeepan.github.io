# Immersive redesign — review branch

Branch: `feature/immersive-redesign`. Base: `0d1d85a`. No production deployment or merge is part of this review.

## Creative direction

Pixel Rice is a world assembled from small, considered ingredients: a few rice grains become a field, material structures frame real work, and the journey resolves around the people who make it. The mood is **tactile, curious, composed**. The reference intersection is Active Theory's spatial continuity, Lusion's material craft and the supplied Pixel Rice boards' editorial pacing; their logos, people and imagery are not assets to copy. Warm charcoal `#11130f` carries ivory `#edeadb`, with restrained olive `#b7bb8e` highlights. Preserve Bodoni Moda for expressive display and Manrope for navigation and readable supporting text, including the exact existing wordmark. The signature movement is the existing descending camera through rice, now meeting folded paper, mineral slabs and illuminated metal/glass frames. The first two seconds show the real founders and legible headline immediately, followed by a gentle entrance without a blocking loader. Sound is absent.

## Existing architecture and constraints

- Next.js 15 / React 19 / TypeScript, React Three Fiber and Three.js; no new runtime dependency needed.
- One native scroll root, `ScrollEngine`, six section windows and `SectionCompositor`; keep the camera's descending direction and single damping source.
- DOM overlays own readable text, real anchors and modal controls. WebGL owns atmosphere and spatial media. Preserve the scroll-root artwork anchor and projected hit area.
- Current portrait WEBPs, logo SVG markup and wordmark styles remain unchanged. Five projects remain, including KAO MING and Sunset; CRM remains excluded. Public website links remain direct, never repository links.
- Existing static export and base path helpers remain supported. Contact saves a brief until an inbox is configured.
- Existing responsive breaks: 767px, 1100px and portrait layouts. Extend with a short-height layout and lower GPU budget on mobile. No portrait or project identity is invented.

## Implementation sequence

1. Centralize presentation motion and add the dedicated People interaction, persistent navigation and clearer contact actions. Extend the existing stylesheet with a scoped redesign layer.
2. Keep the rice instancing code and replace food builders with one reusable material composition module. Use existing renderer environment lighting, no bloom/postprocessing stack.
3. Coordinate hero/studio type and materials using the existing section progress. Shorten idle narrative chapters, retain direct navigation and five project controls.
4. Improve project planes with masks, settling crops and small project-specific motion profiles. Capture authentic public website imagery and record its provenance; keep older assets available.
5. Validate types, motion/lifecycle tests, production/static builds and browser desktop/mobile/keyboard/simple-view flows. Document any unavailable device testing honestly.
6. Commit and push this branch for review; leave `main`, `gh-pages` and the published partner preview untouched.

## Layer and motion contract

Canvas 1 → native scroll/media hit area 2 → text overlay 3 → navigation 20 → dialogs in the native top layer. Text is never baked into WebGL. Only the active overlay accepts focus. Motion uses transform/opacity, a single scroll progress signal and shared timing tokens. Reduced motion uses a calm DOM presentation; hidden tabs pause rendering. Project images load near their viewing window.

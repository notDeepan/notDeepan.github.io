# Reference-led revision

The first prototype was rejected. This revision follows the supplied three cinematic boards, with the current site remaining the source for logo, people, project information and scroll behavior.

## Direction before implementation

- Thesis: the same rice grains connect a quiet entry, a curved field, sculptural materials, real work and real people, resolving into a calm contact ring.
- Qualities: restrained, spatial, warm.
- Reference intersection: the boards' open compositions and material lighting, the existing Pixel Rice identity, and the existing native scroll timeline.
- Palette: near-black, ivory, warm gray; no additional neon accent.
- Type: existing Manrope, light uppercase display and deliberate tracking; retain the exact navigation wordmark and mark.
- Signature motion: retain the instanced rice geometry, grain spin/drift and velocity response; compose the grain offsets into curves and rings. Keep the original camera path and section compositor.
- Entry: a legible three-line statement, a few foreground grains, a stone edge and ample darkness. People appear in their dedicated chapter, using unchanged original portraits.
- Sound: none.

## Technical scope

1. Restore production section durations (4 / 1 / 10 / 3 / 1.5 / 2). No changes to ScrollEngine, scroll math, project focal windows, camera path or compositor.
2. Revise the existing presentation stylesheet and scene markup. Hero evolves into a grain field; ingredients sit left of copy; work uses a left image plane and right metadata; people use three portrait planes; contact sits inside a ring.
3. Extend the existing material scene implementation with shared grain formations and a small stone/glass/paper/chrome composition. Reuse the current renderer and environment lighting. No new runtime dependencies.
4. Keep existing assets and direct website URLs. Preserve exact team image bytes and logo markup. Make mobile layouts intentional and retain simple/reduced-motion access to all content.
5. Build and run tests, then inspect desktop, mobile, keyboard and reduced motion in a local browser. Capture new review screenshots. Commit only the review branch; do not merge or deploy production.

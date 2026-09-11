# Cinematic refinement review branch

Production remains at 5be6fbe. Work layout, its camera path, links, real project data, logo markup and original portrait assets are preserved.

Plan: retain native scroll and the six scene slots. Share one scene/camera across hero and identity, extend the existing instanced rice geometry with a sparse-to-stream-to-ring positional morph, and coordinate DOM labels from the same story progress. Replace stone geometry with thin glass planes, a folded paper surface and a restrained metal frame. Real project textures enter the same planes before the existing Work scene. Stagger the original portrait planes. Shorten mobile travel and remove touch scroll smoothing lag. Keep the existing static reduced-motion presentation and renderer visibility pause.

No new runtime dependencies, renderer, scroll interception, generated imagery or replacement identities. Project previews are decorative introductions; the existing Work links remain the complete accessible destinations. The grain/object relationship is art-directed flow, not a physics simulation.

Validation: typecheck, existing motion/lifecycle/contact tests, new responsive timeline checks, static export, desktop/mobile screenshots and native input checks. Review locally before any further production deployment.

## Completed and verified

- Hero/identity now share one scene, camera and instanced grain field. The compositor renders it once at their chapter boundary; the existing Work scene and later transitions retain their original rendering path.
- Eighteen initial grains gather physically from sparse positions into an open spatial stream, then a ring. Grain shape, seeded composition and lighting language extend the prior shader. Mobile uses 720 instances and lower mesh detail versus 2,100 desktop; existing DPR caps and hidden-tab pause remain.
- Stone meshes and their expensive procedural surface shader are removed. Glass coatings, a folded sheet and a narrow metal frame converge into three real project surfaces. KAO MING becomes dominant before Work enters. Images are contained without stretching or replacement imagery.
- The exact original logo markup, three portrait asset files, project data, destinations, Work camera path, Work component and source assets are unchanged. People styling adds depth and focus around the existing source portraits and selection controls.
- Desktop scene units: 2.5 / 2.5 / 10 / 2 / 1 / 1.4. Mobile: 1.65 / 1.9 / 7.5 / 1.35 / 1 / 1.15. Mobile travel is approximately 34% shorter than the published version. Touch input follows native scroll position directly; the existing smoothed velocity still drives grain response. All five Work focal peaks remain fully reachable.

Validation: static production export and type checks pass. All 15 automated motion, layout, lifecycle and contact tests pass. Browser checks passed at 1440x900, 390x844, 375x667 and 652x698: no horizontal overflow, project captions fit, all five project destinations return HTTP 200, three original portraits load, selection works by tap, dialogs close with Escape and restore focus, native wheel works both directions over artwork, OS reduced motion uses complete static Work without a canvas, and the renderer restores after Simple view. CDP touch events scrolled 0 → 435 → 150 pixels in both directions, and keyboard End reached contact. No page or shader errors in visual QA.

Performance decisions are structural (fewer mobile grains, simpler surfaces, DPR caps, deferred textures, one shared scene render). Browser QA uses Chromium with software WebGL and mobile emulation; physical iPhone/Android GPU performance has not been measured.

Review at http://127.0.0.1:3005/pixel-rice/ on branch feature/cinematic-refinements. No production export directories or deployment branches were changed.

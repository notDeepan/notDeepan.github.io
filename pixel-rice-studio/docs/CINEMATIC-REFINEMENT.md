# Cinematic refinement review branch

Production remains at 5be6fbe. Work layout, its camera path, links, real project data, logo markup and original portrait assets are preserved.

Plan: retain native scroll and the six scene slots. Share one scene/camera across hero and identity, extend the existing instanced rice geometry with a sparse-to-stream-to-ring positional morph, and coordinate DOM labels from the same story progress. Replace stone geometry with thin glass planes, a folded paper surface and a restrained metal frame. Real project textures enter the same planes before the existing Work scene. Stagger the original portrait planes. Shorten mobile travel and remove touch scroll smoothing lag. Keep the existing static reduced-motion presentation and renderer visibility pause.

No new runtime dependencies, renderer, scroll interception, generated imagery or replacement identities. Project previews are decorative introductions; the existing Work links remain the complete accessible destinations. The grain/object relationship is art-directed flow, not a physics simulation.

Validation: typecheck, existing motion/lifecycle/contact tests, new responsive timeline checks, static export, desktop/mobile screenshots and native input checks. Review locally before any further production deployment.

## Completed and verified

- Hero/identity now share one scene, camera and instanced grain field. The compositor renders it once at their chapter boundary; the existing Work scene and later transitions retain their original rendering path.
- Eighteen initial grains gather physically from sparse positions into an open spatial stream, then a ring. Grain shape, seeded composition and lighting language extend the prior shader. Mobile uses 1,100 instances and low mesh detail versus 3,900 desktop; existing DPR caps and hidden-tab pause remain.
- Stone meshes and their expensive procedural surface shader are removed. Glass coatings, a folded sheet and a narrow metal frame converge into three real project surfaces. KAO MING becomes dominant before Work enters. Images are contained without stretching or replacement imagery.
- The exact original logo markup, three portrait asset files, project data, destinations, Work camera path, Work component and source assets are unchanged. People styling adds depth and focus around the existing source portraits and selection controls.
- Desktop scene units: 2.5 / 2.5 / 10 / 2 / 1 / 1.4. Mobile: 1.65 / 1.9 / 7.5 / 1.35 / 1 / 1.15. Mobile travel is approximately 34% shorter than the published version. Touch input follows native scroll position directly; the existing smoothed velocity still drives grain response. All five Work focal peaks remain fully reachable.

Validation: static production export and type checks pass. All 15 automated motion, layout, lifecycle and contact tests pass. Browser checks passed at 1440x900, 390x844, 375x667 and 652x698: no horizontal overflow, project captions fit, all five project destinations return HTTP 200, three original portraits load, selection works by tap, dialogs close with Escape and restore focus, native wheel works both directions over artwork, OS reduced motion uses complete static Work without a canvas, and the renderer restores after Simple view. CDP touch events scrolled 0 → 435 → 150 pixels in both directions, and keyboard End reached contact. No page or shader errors in visual QA.

Performance decisions are structural (fewer mobile grains, simpler surfaces, DPR caps, deferred textures, one shared scene render). Browser QA uses Chromium with software WebGL and mobile emulation; physical iPhone/Android GPU performance has not been measured.

Review at http://127.0.0.1:3005/pixel-rice/ on branch feature/cinematic-refinements. No production export directories or deployment branches were changed.
## Reference matching pass

Creative direction: one weightless installation made of rice and optically coated surfaces; quiet, tactile, cinematic. The supplied five crops are the composition and lighting targets (rather than adding other stylistic references). Near-black #080b0c, warm grey grains #d4c9bb, restrained silver highlights. Manrope Light is the display voice and existing Manrope the readable metadata voice. The signature is an irregular, depth-separated grain stream that settles around reflective planes. The first frame is fully visible and almost still, with no blocking loader and no sound. Keep the existing exact logo and real people even where they differ from the reference assets; retain the user's earlier no-rock restriction.

Execution: align hero type and individual foreground grains to reference proportions; break the uniform ring into layered turbulent strands with smaller grain sizes; add a light depth layer without full-screen post-processing; replace flat coatings with reflected environmental detail and arrange five planes around the vision; crop the original people to shoulders on overlapping diagonal planes. Preserve native scroll and Work.


Reference pass outcome: the hero now follows the supplied title/grain proportions and quiet logo/menu composition. Twelve analytic foreground grain profiles add focus separation without a full-screen blur pass. A curved, layered stream replaces the even C outline; five glass surfaces gather around the centered vision copy. Grain detail was reduced per instance so the denser fine-grain field has a comparable geometry budget. The three original portrait files appear on overlapping, shoulder-cropped planes (Deepan / Junes / Shikhar left to right); controls follow that same order, and each still controls the correct source identity. The ingredient planes retain real portrait fragments before switching to real project screenshots. No rock, generated person or new runtime dependency was added. All Studio, Work, People and Contact destinations remain available through the accessible menu.

Final verification for the reference pass: static export/type checks and the 15 existing tests pass. Browser acceptance passed again for the menu-only desktop navigation, five public project destinations, three mobile sizes, reduced motion, dialogs/focus and renderer restoration; no page/shader errors. A final touch check confirms each name selects the correct original portrait after the visual reorder. The review branch remains separate from production.

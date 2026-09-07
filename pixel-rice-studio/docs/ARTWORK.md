# Founder artwork

Production asset: `public/assets/founders/founders.webp`.

Generated with the built-in image generation tool, then encoded as WebP with Sharp at quality 92 and alpha quality 100. Dimensions: 1536 × 1024. The source is RGBA with genuine transparency; the alpha channel was preserved during encoding. No content editing or background removal scripts were used.

The newly generated portrait depicts Deepan on the left, Junes in the center, and Shikhar on the right. It is intended as fictionalized editorial website artwork informed by the supplied likeness references, rather than as a documentary photograph.

## Reference review

Inspected all ten `team_reference_01.jpeg` through `team_reference_10.jpeg` files from the private reference folder, plus the original team reference, realistic character and site direction board, folded-arms pose reference, and approved founder storyboard.

Read all five character direction prompts, the asset guide, the private reference policy, and the private reference README. The three references used for generation were team references 03 (Junes), 06 (Deepan), and 10 (Shikhar). Original/private photographs remain reference material only and were not copied into public assets or imported in source.

## Generation prompt

```text
Use case: photorealistic-natural.
Asset type: premium creative technology agency website hero, a single cohesive newly created editorial group portrait with THREE founders, genuine transparent background.
Primary request: Create a refined cinematic PHOTOGRAPH of this team as one standalone closely composed group, preserving the recognizable facial likeness and natural build of the three supplied reference people. This must look like a real studio editorial photograph, never an illustration, anime, game character or CGI.
Input images: Image 1 is Junes's facial identity reference (woman in center of generated group). Image 2 is Deepan's facial identity reference (man on left of generated group). Image 3 is Shikhar's facial identity reference (man on right of generated group). Use references for likeness only; do not reproduce their original photos, settings, phones, animals, or social media UI.
Subject and placement: Deepan LEFT: Indian man with brown complexion, round clear glasses, black hair styled loosely with slightly longer waves, subtle mustache and chin hair, dark black relaxed contemporary shirt. Junes CENTER slightly forward: Taiwanese woman with natural East Asian facial proportions like reference, long natural dark hair worn down, warm composed subtle smile, light cream tailored blazer over a dark elegant top and tiny jewelry. Shikhar RIGHT: Indian man, fairer complexion than Deepan, recognizable rectangular dark glasses, slightly stockier build, thick short dark hair, neat natural stubble and moustache, tailored charcoal blazer and light ivory open-collar shirt. All three have naturally folded arms and relaxed confident standing posture. Deepan and Shikhar angle very subtly inward, center woman nearly forward. No dramatic posing.
Composition: Landscape image approx 1536x1024, eye-level 85mm editorial lens. One coherent group packed elegantly together in the center of image with slightly overlapping shoulder silhouettes, all faces unobstructed. Show full head with ample margin above hair, arms and upper body down to hips, do not cut hands or heads. Group fills roughly 85 percent of width. No text or embedded layout; typography will be placed independently in website outside this image.
Lighting: Beautiful subdued cinematic soft key light, subtle warm ivory rim light on hair and shoulders, natural skin pores and believable individual hair strands, rich dark fabrics and restrained warm neutral color grade. Protect skin detail from crushed shadows. Shadows at lower waist can softly darken.
Background: Genuinely TRANSPARENT alpha background so the group can be composited over dark charcoal #11130f. No fake checkerboard, white, gray or colored backdrop. Clean natural alpha edge, no white halo.
Constraints: Exactly these THREE people. Natural human proportions and realistic hands. Preserve skin tones and age appearance in reference. No beauty-filter plastic skin, no excessive facial reshaping, no fantasy clothes, no props, no text, no logo, no watermark.
```

## Individual founder focus layers — 2026-09-07

The original group portrait remains the opening hero. The focused states use `public/assets/founders/junes-portrait.webp`, `deepan-portrait.webp`, and `shikhar-portrait.webp`. Each is independently scaled and faded by CSS. All are generated edits of the existing group artwork with the built-in image-generation tool, then resized to 768 pixels wide and WebP-encoded at quality 90. Junes preserves generated alpha. Deepan and Shikhar use a matching charcoal backdrop; attempts at transparent output returned baked checkerboards and were not used in the site. No private source photographs were added to public assets.

Prompt set: Extract only the named person from the group, preserving their face, hair, glasses, expression, clothing, folded-arm pose, lighting, and texture; reconstruct only occluded parts of their own silhouette, remove the other two people, and frame head to hips with margins. Names/reference positions: Deepan left; Junes center; Shikhar right. Final backdrop edit for the two men: replace the checkerboard only with a flat deep charcoal #11130f, preserving the exact subject and framing, with no text, glow, or scenery. Junes's transparent output was retained directly.

## Transparent founder correction — 2026-09-07

Replaced the two opaque focus portraits with genuine RGBA edits produced by the built-in image generation tool. Exact prompt for each existing portrait: "Remove the background. Keep this exact man, face, clothing, pose and framing unchanged. Transparent background."

Deepan source: `exec-72c7ab2a-05de-4d6b-83cf-9cd0c04a0313.png`. Shikhar source: `exec-4052b639-abda-41fc-a490-55d771018908.png`. Both had a real alpha channel with transparent pixels, preserved through resize to 768px and WebP quality 90 / alpha quality 100. Verified visually in the hero: no dark rectangles. Junes and the initial group were unchanged.

# Deepan Goswami — Portfolio

A professional interactive 3D portfolio. Three.js drives the core visual identity —
a rotating data globe with animated connection arcs (a nod to international strategy and
APAC markets) that recedes as you scroll, over a particle field and wireframe geometry
with scroll parallax. **Kaze**, a procedurally-built 3D guide, lives in a chatbot-style
overlay (bottom right): he greets visitors, narrates each section with voice + text as
you scroll or step through the walkthrough, and stays out of the content's way.

## Stack

- **React 18 + TypeScript + Vite**
- **Three.js via @react-three/fiber** — globe, arcs, particles, parallax shapes; the
  guide avatar is 100% procedural (toon-shaded primitives, canvas-texture face with
  blinking and lip-sync)
- **zustand** — walkthrough state machine
- **Web Speech API** — male narration voice (mute toggle in the widget header)

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Content

All copy — resume data, projects, and the guide's script — lives in `src/data.ts`.

| # | Section |
|---|---|
| 01 | About — summary, languages, availability |
| 02 | Experience — HCL Technologies, thesis research, consulting projects |
| 03 | Projects — top 5 from GitHub, linked to source |
| 04 | Skills — technical × strategy × process |
| 05 | Education — degrees, scholarships, certifications |
| 06 | Contact |

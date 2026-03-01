# 3D Model Builder

Build and explore prompt-driven 3D objects directly in the browser.

Type a prompt like `gold metallic torus` or `tiny blue glass sphere`, then generate an interactive 3D model you can rotate and zoom.

## Features

- Prompt-to-model generation for multiple shapes (`sphere`, `cube`, `torus`, `cone`, `cylinder`, `pyramid`, `crystal`, `capsule`)
- Prompt-driven visual style:
  - color keywords
  - metallic or glass-like material
  - glowing emissive effect
  - size modifiers (`tiny`, `small`, `large`, `giant`)
- Interactive viewport controls:
  - drag to rotate
  - scroll / trackpad pinch to zoom
  - reset camera button
- Quick prompt chips for one-click examples
- Live build status message describing what was generated

## Example prompts

- `glowing crystal sphere`
- `gold metallic torus`
- `tiny blue glass sphere`
- `large green cone`
- `fast red cube`
- `static silver cylinder`

## Tech stack

- [Three.js](https://threejs.org/)
- OrbitControls (Three.js examples)
- Vanilla HTML/CSS/JavaScript (ES modules)

## Run locally

```bash
python3 -m http.server 4173
```

Open <http://localhost:4173>.

## Project structure

```text
.
├── index.html   # UI layout (prompt input, buttons, example chips, canvas mount)
├── app.js       # Three.js scene setup and prompt parsing/model generation logic
└── README.md
```

## Notes

- This app is a deterministic keyword parser, not a full text-to-3D AI model.
- Extend `colorMap` and `shapes` in `app.js` to add more vocabulary and geometry options.

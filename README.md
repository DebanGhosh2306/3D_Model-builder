# 3D Model Builder

A lightweight browser app that generates a **scrollable 3D model** from a text prompt.

## Features
- Prompt-driven shape generation (`sphere`, `cube`, `torus`, `cone`, `cylinder`, `pyramid`, `crystal`, `capsule`)
- Prompt-driven styling for color and materials (metal, glass, glowing, etc.)
- Mouse/touchpad interaction:
  - Drag to rotate
  - Scroll to zoom
- Real-time animated render using Three.js

## Run locally
Because this app uses ES modules, serve the folder with a local web server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

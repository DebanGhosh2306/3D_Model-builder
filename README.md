# 3D Model Builder

Build and explore a prompt-driven 3D object directly in the browser.

This project lets you type a natural-language prompt (for example, **"gold metallic torus"**) and generates an interactive 3D model you can rotate and zoom.

## ✨ What it does

- Generates a 3D model from prompt keywords.
- Supports interactive camera controls:
  - **Drag** to rotate
  - **Scroll** to zoom
- Applies prompt-based styling:
  - Shape (sphere, cube, torus, cone, etc.)
  - Color (red, blue, gold, silver, etc.)
  - Material traits (metallic, glassy, glowing)

## 🧠 Prompt examples

Try any of these:

- `glowing crystal sphere`
- `red cube`
- `blue glass sphere`
- `gold metallic torus`
- `green cone`

## 🛠 Tech stack

- [Three.js](https://threejs.org/) for rendering and geometry
- Vanilla HTML/CSS/JavaScript (ES modules)
- `OrbitControls` for smooth rotate/zoom interaction

## 🚀 Run locally

Because this app uses ES modules, run it through a local web server.

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## 📁 Project structure

```text
.
├── index.html   # App layout and UI controls
├── app.js       # Three.js scene + prompt parsing logic
└── README.md
```

## 📌 Notes

- This is a keyword-based prompt interpreter (not a full text-to-3D AI generator).
- You can extend `colorMap` and `shapes` in `app.js` to support more prompt vocabulary.

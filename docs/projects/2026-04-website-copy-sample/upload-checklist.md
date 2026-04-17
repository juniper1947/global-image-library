# Project Intake Checklist: 2026-04-website-copy-sample

Intake type: `website`
Source: `https://example.com`
Notes: (optional)

## Steps
1. Collect original image references (URL, screenshot name, or extracted src).
2. Place files in `docs/uploads/2026-04-website-copy-sample/`.
3. Rename files with ordered names (example: `01-hero.png`, `02-feature-grid.png`).
4. Add relative paths to `docs/images.json`.
5. Copy direct URLs from gallery and use in target project.

## Optional email manifest
If source is email HTML, run:

```bash
npm run extract:images -- --html /absolute/path/to/source-email.html --project 2026-04-website-copy-sample
```

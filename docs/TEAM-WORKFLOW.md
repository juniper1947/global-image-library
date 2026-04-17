# Global Image Library Team Workflow

Use this workflow for every project so assets stay centralized and traceable.

## 1. Project Slug
Create one slug per project, for example:

- `2026-04-training-hub-launch`
- `2026-04-client-onboarding-email`

Use lowercase letters, numbers, and hyphens.

## 2. Extract Image Placement From Source Email
Run this command from repo root:

```bash
node scripts/extract-email-images.js --html /absolute/path/to/source-email.html --project 2026-04-training-hub-launch
```

This creates:

- `docs/projects/<project-slug>/manifest.json`
- `docs/projects/<project-slug>/upload-checklist.md`

These files keep image order, original source URL, context, and target filename.

## 3. Upload Images To Library
Upload files into:

`docs/uploads/<project-slug>/`

Use the suggested names from `upload-checklist.md`.

## 4. Register Images In Gallery
Add paths to `docs/images.json`, for example:

```json
[
  "2026-04-training-hub-launch/01-hero-training-hub.png",
  "2026-04-training-hub-launch/02-sign-up-step.png"
]
```

## 5. Reuse In Any Project
Copy URL from the gallery card. It uses stable CDN format:

`https://cdn.jsdelivr.net/gh/juniper1947/global-image-library@main/docs/uploads/<project-slug>/<filename>`

This works across all projects and folders.

## 6. Rename/Delete Rules
- Do not rename files after links are used in live emails.
- If a file must change, upload a new file with a new name/version.
- Keep old files if they are already referenced in sent campaigns.

# Global Image Library Team Workflow

Use this workflow for every project so assets stay centralized and traceable.
This includes:

- email template projects
- website copy/rebuild projects from URL
- screenshot-based projects

## 1. Project Slug
Create one slug per project, for example:

- `2026-04-training-hub-launch`
- `2026-04-client-onboarding-email`

Use lowercase letters, numbers, and hyphens.

## 2. Initialize Any New Project (required)
Run this first from repo root:

```bash
npm run init:project -- --project 2026-04-client-landing --type website --source https://client-site.example.com
```

Supported `--type` values:

- `email`
- `website`
- `screenshot`
- `general`

This creates:

- `docs/projects/<project-slug>/project.json`
- `docs/projects/<project-slug>/upload-checklist.md`
- `docs/uploads/<project-slug>/`

## 3. Email Intake (if source is HTML email)
Run this command:

```bash
node scripts/extract-email-images.js --html /absolute/path/to/source-email.html --project 2026-04-training-hub-launch
```

This creates:

- `docs/projects/<project-slug>/manifest.json`
- `docs/projects/<project-slug>/upload-checklist.md`

These files keep image order, original source URL, context, and target filename.

## 4. Website/Screenshot Intake (if source is URL or screenshots)
1. Collect image assets from source website or screenshots.
2. Save and rename into:

`docs/uploads/<project-slug>/`

3. Use ordered names matching page placement:
- `01-hero.png`
- `02-feature-grid.png`
- `03-footer-badges.png`

## 5. Upload Images To Library
Upload files into:

`docs/uploads/<project-slug>/`

Use the suggested names from `upload-checklist.md`.

## 6. Register Images In Gallery
Add paths to `docs/images.json`, for example:

```json
[
  "2026-04-training-hub-launch/01-hero-training-hub.png",
  "2026-04-training-hub-launch/02-sign-up-step.png"
]
```

## 7. Reuse In Any Project
Copy URL from the gallery card. It uses stable CDN format:

`https://cdn.jsdelivr.net/gh/juniper1947/global-image-library@main/docs/uploads/<project-slug>/<filename>`

This works across all projects and folders.

## 8. Rename/Delete Rules
- Do not rename files after links are used in live emails/websites.
- If a file must change, upload a new file with a new name/version.
- Keep old files if they are already referenced in live projects or sent campaigns.

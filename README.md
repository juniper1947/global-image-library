# Global Image Library

A simple reusable image-hosting web app for all projects.

## Features
- Upload image files (jpg, png, webp, gif, svg)
- Get a permanent public URL (as long as file stays on server)
- View uploaded images in a simple gallery
- Copy project-safe URLs from one central library
- Trace image placement from source emails using project manifests

## Setup

```bash
cd global-image-library
npm install
npm start
```

Server runs on:
- `http://localhost:3000`

## Optional env variables
- `PORT` (default: `3000`)
- `BASE_URL` (default: `http://localhost:3000`)

For real hosting, set `BASE_URL` to your domain, for example:

```bash
BASE_URL=https://img.yourdomain.com npm start
```

## Important notes for Gmail usage
- Use the **direct image URL** returned by upload
- Keep files on server (do not rename/delete)
- Serve using **HTTPS** in production

## GitHub Pages upload workflow (recommended)
1. Open this folder in GitHub: `docs/uploads`
2. Click **Add file -> Upload files**
3. Upload image(s) and commit to `main`
4. Wait about 30-60 seconds for GitHub Actions + Pages deploy
5. Open gallery: `https://juniper1947.github.io/global-image-library/`

## Website upload button (no server required)
The live page now includes an **Upload from Website** button using Cloudinary unsigned uploads.

Setup once:
1. Create a Cloudinary account
2. Create an **unsigned upload preset**
3. Open `docs/config.js`
4. Fill:
   - `cloudinaryCloudName`
   - `cloudinaryUnsignedPreset`
5. Commit and push to `main`

After that, uploads from the website are direct and instant.
If Cloudinary values are empty, the page automatically shows a GitHub upload fallback button.

### Optional upload passcode
You can require a passcode before website upload is enabled.

1. Set/rotate passcode hash with:
   ```bash
   npm run set:upload-passcode -- "your-strong-passcode"
   ```
2. Commit and push:
   ```bash
   git add docs/config.js
   git commit -m "Rotate upload passcode hash"
   git push origin main
   ```
3. Refresh live page and verify upload is locked until passcode is entered

Security note:
- Passcode lock on a static page is a deterrent, not full security
- For true private upload/access control, use a backend with authenticated signed uploads

## Team System (for all current and future projects)
Use a project slug and keep images grouped by project:

- `docs/uploads/<project-slug>/<filename>`

Start every project with intake init (email, website URL, or screenshot project):

```bash
npm run init:project -- --project 2026-04-client-landing --type website --source https://client-site.example.com
```

Before upload, generate a traceable placement manifest:

```bash
npm run extract:images -- --html /absolute/path/to/source-email.html --project 2026-04-training-hub-launch
```

This creates:
- `docs/projects/<project-slug>/manifest.json`
- `docs/projects/<project-slug>/upload-checklist.md`

Then upload the files and add relative paths to `docs/images.json`, for example:

```json
[
  "2026-04-training-hub-launch/01-hero-training-hub.png",
  "2026-04-training-hub-launch/02-step-sign-up.png"
]
```

Full team instructions:
- See `docs/TEAM-WORKFLOW.md`

### Direct image URL formats
Preferred (stable across projects):  
`https://cdn.jsdelivr.net/gh/juniper1947/global-image-library@main/docs/uploads/<filename>`

Also works from GitHub Pages site path:  
`https://juniper1947.github.io/global-image-library/docs/uploads/<filename>`

### Rename or delete
- Rename: open file -> edit (pencil) -> change filename -> commit
- Delete: open file -> trash icon -> commit
- If you upload directly in GitHub, update `docs/images.json` when adding/removing files so gallery listing stays current

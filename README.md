# Global Image Library

A simple reusable image-hosting web app for all projects.

## Features
- Upload image files (jpg, png, webp, gif, svg)
- Get a permanent public URL (as long as file stays on server)
- View uploaded images in a simple gallery
- Copy project-safe URLs from one central library

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

1. Generate SHA-256 hash of your passcode
2. Put the lowercase hash in `docs/config.js` as `uploadPasscodeHash`
3. Commit and deploy

Security note:
- Passcode lock on a static page is a deterrent, not full security
- For true private upload/access control, use a backend with authenticated signed uploads

### Direct image URL formats
Preferred (stable across projects):  
`https://cdn.jsdelivr.net/gh/juniper1947/global-image-library@main/docs/uploads/<filename>`

Also works from GitHub Pages site path:  
`https://juniper1947.github.io/global-image-library/docs/uploads/<filename>`

### Rename or delete
- Rename: open file -> edit (pencil) -> change filename -> commit
- Delete: open file -> trash icon -> commit
- If you upload directly in GitHub, update `docs/images.json` when adding/removing files so gallery listing stays current

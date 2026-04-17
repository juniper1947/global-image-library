# Global Image Library

A simple reusable image-hosting web app for all projects.

## Features
- Upload image files (jpg, png, webp, gif, svg)
- Get a permanent public URL (as long as file stays on server)
- View uploaded images in a simple gallery

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

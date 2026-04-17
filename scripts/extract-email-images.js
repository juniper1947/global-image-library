#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const val = argv[i + 1];
    if (!key.startsWith("--")) continue;
    out[key.slice(2)] = val;
    i += 1;
  }
  return out;
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function stripTags(html) {
  return String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function getAttr(tag, name) {
  const rx = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = tag.match(rx);
  if (!match) return "";
  return (match[2] || match[3] || match[4] || "").trim();
}

function guessContext(beforeHtml) {
  const tags = [...beforeHtml.matchAll(/<(h[1-6]|p|td|th)[^>]*>([\s\S]*?)<\/\1>/gi)];
  for (let i = tags.length - 1; i >= 0; i -= 1) {
    const text = stripTags(tags[i][2]);
    if (text && text.length >= 3) return text.slice(0, 80);
  }
  return "";
}

function extFromSrc(src) {
  const clean = String(src || "").split("?")[0].split("#")[0];
  const ext = path.extname(clean).toLowerCase();
  if (ext && ext.length <= 6) return ext;
  return ".png";
}

function safeNameCandidate(value, fallback) {
  const base = slugify(value);
  return base || fallback;
}

function buildManifest(html, projectSlug) {
  const imgRegex = /<img\b[^>]*>/gi;
  const matches = [...html.matchAll(imgRegex)];
  const results = [];

  for (let i = 0; i < matches.length; i += 1) {
    const fullTag = matches[i][0];
    const pos = matches[i].index || 0;
    const src = getAttr(fullTag, "src");
    if (!src) continue;

    const alt = getAttr(fullTag, "alt");
    const before = html.slice(0, pos);
    const context = guessContext(before);
    const order = i + 1;
    const ext = extFromSrc(src);
    const baseName = safeNameCandidate(context || alt || `image-${order}`, `image-${order}`);
    const finalName = `${String(order).padStart(2, "0")}-${baseName}${ext}`;

    results.push({
      order,
      originalSrc: src,
      alt: alt || "",
      context: context || "",
      suggestedFileName: finalName,
      targetPath: `docs/uploads/${projectSlug}/${finalName}`
    });
  }

  return results;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function writeChecklist(filePath, projectSlug, entries) {
  const lines = [];
  lines.push(`# Upload Checklist: ${projectSlug}`);
  lines.push("");
  lines.push(`Project upload folder: \`docs/uploads/${projectSlug}\``);
  lines.push("");
  lines.push("| # | Original src | Suggested filename | Target path |");
  lines.push("|---|---|---|---|");
  for (const row of entries) {
    lines.push(`| ${row.order} | ${row.originalSrc.replace(/\|/g, "\\|")} | ${row.suggestedFileName} | ${row.targetPath} |`);
  }
  lines.push("");
  lines.push("After upload, update `docs/images.json` with each relative path:");
  lines.push("");
  for (const row of entries) {
    lines.push(`- \`${projectSlug}/${row.suggestedFileName}\``);
  }
  lines.push("");
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
}

function main() {
  const args = parseArgs(process.argv);
  const htmlFile = args.html;
  const projectSlug = slugify(args.project || "");

  if (!htmlFile || !projectSlug) {
    console.error("Usage: node scripts/extract-email-images.js --html <file.html> --project <project-slug>");
    process.exit(1);
  }

  const root = process.cwd();
  const htmlPath = path.resolve(root, htmlFile);
  if (!fs.existsSync(htmlPath)) {
    console.error(`File not found: ${htmlPath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(htmlPath, "utf8");
  const rows = buildManifest(html, projectSlug);
  const projectDir = path.join(root, "docs", "projects", projectSlug);
  ensureDir(projectDir);

  const manifest = {
    project: projectSlug,
    sourceHtml: path.relative(root, htmlPath),
    extractedAt: new Date().toISOString(),
    imageCount: rows.length,
    images: rows
  };

  writeJson(path.join(projectDir, "manifest.json"), manifest);
  writeChecklist(path.join(projectDir, "upload-checklist.md"), projectSlug, rows);

  console.log(`Created manifest for ${rows.length} images:`);
  console.log(`- docs/projects/${projectSlug}/manifest.json`);
  console.log(`- docs/projects/${projectSlug}/upload-checklist.md`);
}

main();

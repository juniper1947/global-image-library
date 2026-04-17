#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i += 1) {
    const part = argv[i];
    if (!part.startsWith("--")) continue;
    const key = part.slice(2);
    const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : "";
    out[key] = val;
    if (val) i += 1;
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

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeIfMissing(filePath, contents) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, contents, "utf8");
  }
}

function main() {
  const args = parseArgs(process.argv);
  const projectSlug = slugify(args.project || "");
  const intakeType = (args.type || "general").toLowerCase();
  const source = args.source || "";
  const notes = args.notes || "";

  if (!projectSlug) {
    console.error("Usage: node scripts/init-library-project.js --project <slug> [--type email|website|screenshot|general] [--source <url_or_file>] [--notes <text>]");
    process.exit(1);
  }

  const root = process.cwd();
  const projectDir = path.join(root, "docs", "projects", projectSlug);
  const uploadDir = path.join(root, "docs", "uploads", projectSlug);
  ensureDir(projectDir);
  ensureDir(uploadDir);

  writeIfMissing(path.join(uploadDir, ".gitkeep"), "");

  const projectFile = {
    project: projectSlug,
    intakeType,
    source,
    notes,
    createdAt: new Date().toISOString(),
    uploadFolder: `docs/uploads/${projectSlug}`,
    status: "intake_started",
    requiredArtifacts: [
      "project.json",
      "upload-checklist.md",
      "manifest.json (for email intake via extract:images)"
    ]
  };

  writeIfMissing(path.join(projectDir, "project.json"), `${JSON.stringify(projectFile, null, 2)}\n`);

  const checklist = [
    `# Project Intake Checklist: ${projectSlug}`,
    "",
    `Intake type: \`${intakeType}\``,
    source ? `Source: \`${source}\`` : "Source: (add source URL/file here)",
    notes ? `Notes: ${notes}` : "Notes: (optional)",
    "",
    "## Steps",
    "1. Collect original image references (URL, screenshot name, or extracted src).",
    `2. Place files in \`docs/uploads/${projectSlug}/\`.`,
    "3. Rename files with ordered names (example: `01-hero.png`, `02-feature-grid.png`).",
    "4. Add relative paths to `docs/images.json`.",
    "5. Copy direct URLs from gallery and use in target project.",
    "",
    "## Optional email manifest",
    "If source is email HTML, run:",
    "",
    "```bash",
    `npm run extract:images -- --html /absolute/path/to/source-email.html --project ${projectSlug}`,
    "```",
    ""
  ].join("\n");

  writeIfMissing(path.join(projectDir, "upload-checklist.md"), checklist);

  console.log("Project initialized:");
  console.log(`- docs/projects/${projectSlug}/project.json`);
  console.log(`- docs/projects/${projectSlug}/upload-checklist.md`);
  console.log(`- docs/uploads/${projectSlug}/`);
}

main();

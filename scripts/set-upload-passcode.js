#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const passcode = process.argv[2];
if (!passcode) {
  console.error('Usage: node scripts/set-upload-passcode.js "<your-passcode>"');
  process.exit(1);
}

const hash = crypto.createHash('sha256').update(passcode).digest('hex');
const configPath = path.join(__dirname, '..', 'docs', 'config.js');
const source = fs.readFileSync(configPath, 'utf8');
const next = source.replace(
  /uploadPasscodeHash:\s*"[^"]*"/,
  `uploadPasscodeHash: "${hash}"`
);

if (next === source) {
  console.error('Could not find uploadPasscodeHash in docs/config.js');
  process.exit(1);
}

fs.writeFileSync(configPath, next, 'utf8');
console.log(`Updated docs/config.js with upload passcode hash: ${hash}`);

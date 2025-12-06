"use strict";

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.cwd(), 'src');
const exts = ['.js', '.jsx', '.ts', '.tsx', '.mdx', '.html'];

function isTextFile(filename) {
  return exts.includes(path.extname(filename).toLowerCase());
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) results = results.concat(walk(full));
    else if (e.isFile() && isTextFile(full)) results.push(full);
  }
  return results;
}

function findImgTags(file) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const hits = [];
  const regex = /<img(\s|>)/i;
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) hits.push({ line: i + 1, text: lines[i].trim() });
  }
  return hits;
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.log('No src/ directory found — nothing to scan.');
    return 0;
  }

  const files = walk(ROOT);
  let total = 0;
  for (const f of files) {
    const hits = findImgTags(f);
    if (hits.length) {
      console.log(`\nFound ${hits.length} <img> usage(s) in: ${path.relative(process.cwd(), f)}`);
      for (const h of hits) {
        console.log(`  ${h.line}: ${h.text}`);
        total++;
      }
    }
  }

  if (total === 0) console.log('\nNo plain <img> tags found in src/. Good job!');
  else console.log(`\nTotal plain <img> occurrences: ${total}`);

  return 0;
}

if (require.main === module) process.exitCode = main();

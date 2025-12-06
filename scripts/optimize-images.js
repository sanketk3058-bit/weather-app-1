"use strict";

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const SRC_DIR = path.resolve(process.cwd(), 'assets-src');
const OUT_DIR = path.resolve(process.cwd(), 'public', 'images');

function isImageFile(name) {
  const ext = path.extname(name).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.bmp', '.gif', '.webp', '.avif'].includes(ext);
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function walk(dir) {
  let results = [];
  const entries = await fsp.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(await walk(res));
    } else if (entry.isFile() && isImageFile(entry.name)) {
      results.push(res);
    }
  }
  return results;
}

async function statSafe(p) {
  try { return await fsp.stat(p); } catch (e) { return null; }
}

(async function main() {
  // Try to load sharp only when needed; if not installed, give clear message and exit non-zero.
  let sharp;
  try {
    sharp = require('sharp');
  } catch (err) {
    console.error('\nMissing optional dependency: "sharp"');
    console.error('To enable image optimization, install sharp as a dev dependency and run this script again:\n');
    console.error('  npm i --save-dev sharp');
    console.error('  npm run optimize:images\n');
    console.error('This repository keeps the script in-tree but does not force-install sharp.');
    process.exit(1);
  }

  // If source folder doesn't exist or is empty, exit gracefully (0) — script is safe to exist.
  const srcStat = await statSafe(SRC_DIR);
  if (!srcStat || !srcStat.isDirectory()) {
    console.log('No "assets-src/" directory found. Create `assets-src/` and add source images to opt-in.');
    console.log('Nothing to do.');
    process.exit(0);
  }

  const files = await walk(SRC_DIR);
  if (!files.length) {
    console.log('No source images found in "assets-src/". Add images and re-run.');
    process.exit(0);
  }

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const rel = path.relative(SRC_DIR, file);
    const relDir = path.dirname(rel);
    const baseName = path.basename(rel, path.extname(rel));
    const outDir = path.join(OUT_DIR, relDir);
    await ensureDir(outDir);

    const outAvif = path.join(outDir, baseName + '.avif');
    const outWebp = path.join(outDir, baseName + '.webp');

    const srcStat = await fsp.stat(file);

    // If both outputs exist and are newer than source, skip.
    const outAvifStat = await statSafe(outAvif);
    const outWebpStat = await statSafe(outWebp);
    const upToDateAvif = outAvifStat && outAvifStat.mtimeMs >= srcStat.mtimeMs;
    const upToDateWebp = outWebpStat && outWebpStat.mtimeMs >= srcStat.mtimeMs;

    if (upToDateAvif && upToDateWebp) {
      skipped += 1;
      console.log(`skip: ${rel} (outputs up-to-date)`);
      continue;
    }

    try {
      // Convert to AVIF
      if (!upToDateAvif) {
        await sharp(file)
          .toFormat('avif', { quality: 60 })
          .toFile(outAvif);
        console.log(`wrote: ${path.relative(process.cwd(), outAvif)}`);
      }

      // Convert to WebP
      if (!upToDateWebp) {
        await sharp(file)
          .toFormat('webp', { quality: 75 })
          .toFile(outWebp);
        console.log(`wrote: ${path.relative(process.cwd(), outWebp)}`);
      }

      processed += 1;
    } catch (e) {
      errors += 1;
      console.error(`error processing ${rel}:`, e && e.message ? e.message : e);
    }
  }

  console.log('\nSummary:');
  console.log(`  processed: ${processed}`);
  console.log(`  skipped:   ${skipped}`);
  console.log(`  errors:    ${errors}`);

  if (errors) process.exit(2);
  process.exit(0);
})();

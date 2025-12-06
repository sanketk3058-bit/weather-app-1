"use strict";

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const SRC_SVG = path.join(process.cwd(), 'public', 'favicon.svg');
const OUT_ICO = path.join(process.cwd(), 'public', 'favicon.ico');

(async function main() {
  try {
    // Ensure the source SVG exists
    await fs.access(SRC_SVG);
  } catch (err) {
    console.error('Source SVG not found at', SRC_SVG);
    process.exit(1);
  }

  // Generate a single multi-resolution ICO using sharp directly (sharp supports ICO output)
  // We'll render a nice 64x64 image which serves as a good legacy fallback.
  try {
    await sharp(SRC_SVG)
      .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(OUT_ICO);
    console.log('Wrote (via sharp):', OUT_ICO);
    process.exit(0);
  } catch (e) {
    console.error('Error generating favicon.ico:', e && e.message ? e.message : e);
    process.exit(2);
  }
})();

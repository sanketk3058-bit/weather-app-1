# Image Optimization (opt-in)

- Purpose: Provide a small developer-run script to convert raw images into efficient formats (AVIF and WebP) for deployment under `public/images/`.

- Source images: Place high-quality originals under `assets-src/` (preserve any directory structure you want mirrored in `public/images/`). Example:

  - `assets-src/icons/logo.png` -> will produce `public/images/icons/logo.avif` and `public/images/icons/logo.webp`

- How to run (developer opt-in):

  1. Install the optional converter locally (not added automatically):

     ```pwsh
     npm i --save-dev sharp
     ```

  2. Run the script:

     ```pwsh
     npm run optimize:images
     ```

  - The script will look for images in `assets-src/` recursively and write `*.avif` and `*.webp` versions under `public/images/`, preserving subdirectories.
  - If `sharp` is not installed, the script prints a clear instruction and exits non-zero; nothing in the repo is changed automatically.

- Format choices & quality:
  - AVIF: `quality: 60` (good tradeoff of size vs quality)
  - WebP: `quality: 75` (fallback for older browsers/sites)

- Safety & idempotence:
  - The script checks timestamps and skips outputs that are already newer than the source file to avoid unnecessary work.
  - Keep source originals in `assets-src/` — the script never deletes sources.
  - `public/images/` contains only generated files (and a `.gitkeep` placeholder in this repo); generated files can be committed if you want them deployed.

- Rollback:
  - If you want to remove generated images, delete the corresponding files from `public/images/` (or restore from git). The source images in `assets-src/` remain untouched.

- Notes:
  - This is an opt-in developer tool. We intentionally do not add `sharp` to devDependencies automatically because it has native bindings and sometimes needs platform-specific installation steps.
  - Tests and runtime code are not altered by this script.

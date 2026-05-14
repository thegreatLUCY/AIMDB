// Scans public/posters/ for cast headshot files and writes a manifest to
// data/cast-photos.json. Run before `next dev` and `next build` via the
// `predev` / `prebuild` hooks in package.json.
//
// Why this exists: we used to call fs.readdirSync at request time to discover
// which cast photos had been generated. On Netlify Functions the public/
// folder isn't accessible via fs at runtime AND the bundler tried to inline
// the whole 200+ MB posters directory into the function — failing the upload.
// Computing the manifest at build time keeps the runtime code fs-free and
// the function bundle tiny.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTERS_DIR = path.join(__dirname, "..", "public", "posters");
const OUT = path.join(__dirname, "..", "data", "cast-photos.json");

let files = [];
try {
  files = fs
    .readdirSync(POSTERS_DIR)
    .filter((f) => /-cast-\d+\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();
} catch (err) {
  console.warn(`[build-cast-manifest] posters dir not readable: ${err.message}`);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  count: files.length,
  files,
};

fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log(`[build-cast-manifest] wrote ${files.length} cast photos -> ${path.relative(process.cwd(), OUT)}`);

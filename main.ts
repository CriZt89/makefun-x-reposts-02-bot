// makefun-x-reposts-02: copy POSTS.json from the repository to /output.
// Node 22, standard library only, no network access.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

const src = join(botDir, "POSTS.json");
const raw = readFileSync(src, "utf8");
const data = JSON.parse(raw);

if (!data || !Array.isArray(data.posts)) {
  throw new Error("POSTS.json must be a JSON object with a posts array");
}
if (data.posts.length > 15) {
  throw new Error(`POSTS.json names ${data.posts.length} posts, at most 15 allowed`);
}
for (const post of data.posts) {
  if (typeof post !== "string" || !/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\//.test(post)) {
    throw new Error(`not an X post address: ${String(post)}`);
  }
}

mkdirSync(outDir, { recursive: true });
const dest = join(outDir, "POSTS.json");
writeFileSync(dest, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`wrote ${data.posts.length} post(s) to ${dest}`);

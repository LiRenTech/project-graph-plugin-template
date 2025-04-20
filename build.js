// @ts-check
import * as esbuild from "esbuild";
import { readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  await esbuild.build({
    entryPoints: ["src/main.ts"],
    outfile: "dist/plugin.js",
    bundle: true,
    minify: true,
  });
  const manifest = JSON.parse(
    await readFile(join(__dirname, "manifest.json"), "utf-8")
  );
  const header = `// ==UserScript==
// @name         ${manifest.name}
// @version      ${manifest.version}
// @description  ${manifest.description}
// @author       ${manifest.author}
// ==/UserScript==
`;
  const content = await readFile(join(__dirname, "dist/plugin.js"), "utf-8");
  await writeFile(join(__dirname, "dist/plugin.js"), `${header}${content}`);
})();

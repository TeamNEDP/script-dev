import esbuild from "esbuild";
import fs from "fs";

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    outfile: "main.js",
    globalName: "theScript",
    target: ["es6"],
  })
  .catch(() => process.exit(1))
  .then(() => {
    fs.appendFile("main.js", "Tick = theScript.default", () => {});
  });

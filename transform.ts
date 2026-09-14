/**
 * Build script for @dldc/styles.
 *
 * Copies every file under `src/` into `dist/`, then rewrites the copied
 * JavaScript/TypeScript sources with `@wyw-in-js/transform` so that the
 * `css(...)` (and friends) calls from `dx-styles` are evaluated at build time.
 * The extracted CSS is written alongside each transformed file as a `.css`
 * sibling.
 */

import { copy } from "@std/fs/copy";
import { ensureDir } from "@std/fs/ensure-dir";
import { walk } from "@std/fs/walk";
import { dirname, extname, fromFileUrl, join, relative } from "@std/path";
import {
  disposeEvalBroker,
  EventEmitter,
  transform,
  TransformCacheCollection,
} from "@wyw-in-js/transform";

const SOURCE_DIR = fromFileUrl(new URL("./src", import.meta.url));
const OUT_DIR = fromFileUrl(new URL("./dist", import.meta.url));

const SOURCE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
]);
const RESOLVE_SUFFIXES = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];

type AsyncResolve = (
  what: string,
  importer: string,
  stack: string[],
) => Promise<string | null>;

const candidates = (base: string): string[] => {
  const list = [base];
  for (const ext of RESOLVE_SUFFIXES) {
    list.push(`${base}${ext}`);
  }
  for (const ext of RESOLVE_SUFFIXES) {
    list.push(join(base, `index${ext}`));
  }
  return list;
};

const resolveRelative = async (
  what: string,
  importer: string,
): Promise<string | null> => {
  const base = join(dirname(importer), what);
  for (const candidate of candidates(base)) {
    try {
      const stat = await Deno.stat(candidate);
      if (stat.isFile) {
        return candidate;
      }
    } catch {
      // not found, try the next candidate
    }
  }
  return null;
};

/**
 * Minimal module resolver used by wyw-in-js to build the dependency graph.
 * Relative imports are resolved against the importer on disk; bare specifiers
 * (e.g. `dx-styles`) are resolved through Deno's import map via
 * `import.meta.resolve`.
 */
const asyncResolve: AsyncResolve = async (what, importer, _stack) => {
  if (what.startsWith(".")) {
    return resolveRelative(what, importer);
  }
  try {
    return fromFileUrl(import.meta.resolve(what));
  } catch {
    return null;
  }
};

async function transformFile(
  sourceFile: string,
  outFile: string,
): Promise<boolean> {
  const source = await Deno.readTextFile(sourceFile);
  const cache = new TransformCacheCollection();

  try {
    const services = {
      cache,
      eventEmitter: EventEmitter.dummy,
      options: {
        filename: sourceFile,
        outputFilename: outFile,
        pluginOptions: {
          configFile: false as const,
          outputMetadata: false,
        },
        root: SOURCE_DIR,
      },
    };

    const { code, cssText, diagnostics } = await transform(
      services,
      source,
      asyncResolve,
    );

    if (diagnostics?.length) {
      for (const diagnostic of diagnostics) {
        console.error(
          `[wyw-in-js] ${
            diagnostic.filename ?? sourceFile
          }: ${diagnostic.message}`,
        );
      }
    }

    await ensureDir(dirname(outFile));
    await Deno.writeTextFile(outFile, code);

    if (typeof cssText === "string" && cssText.length > 0) {
      await Deno.writeTextFile(`${outFile}.css`, cssText);
      return true;
    }

    return false;
  } finally {
    disposeEvalBroker(cache);
    cache.clear("all");
  }
}

async function main() {
  await ensureDir(OUT_DIR);

  let extracted = 0;

  for await (const entry of walk(SOURCE_DIR)) {
    if (!entry.isFile) {
      continue;
    }

    const rel = relative(SOURCE_DIR, entry.path);
    const outFile = join(OUT_DIR, rel);

    if (SOURCE_EXTENSIONS.has(extname(entry.path))) {
      if (await transformFile(entry.path, outFile)) {
        extracted += 1;
      }
      continue;
    }

    await ensureDir(dirname(outFile));
    await copy(entry.path, outFile, { overwrite: true });
  }

  console.log(
    `Copied ${SOURCE_DIR} -> ${OUT_DIR} and extracted ${extracted} CSS file(s).`,
  );
}

await main();

/**
 * Build script for @dldc/styles.
 *
 * Copies every file under `src/` into `dist/`, then rewrites the copied
 * JavaScript/TypeScript sources with `@wyw-in-js/transform` so that the
 * `css(...)` (and friends) calls from `dx-styles` are evaluated at build time.
 *
 * The extracted CSS is not emitted as a standalone asset: it is inlined into
 * the transformed JavaScript using the injection logic from
 * `vite-plugin-css-injected-by-js` (see `defaultInjectCode`,
 * `resolveInjectionCode` and the top-execution-priority prepend in
 * `buildOutputChunkWithCssInjectionCode`). When the module runs in the
 * browser it creates a `<style>` element and appends the CSS to the document.
 */

import { copy } from "@std/fs/copy";
import { ensureDir } from "@std/fs/ensure-dir";
import { walk } from "@std/fs/walk";
import {
  dirname,
  extname,
  fromFileUrl,
  join,
  relative,
} from "@std/path";
import {
  disposeEvalBroker,
  EventEmitter,
  transform,
  TransformCacheCollection,
} from "@wyw-in-js/transform";

const SOURCE_DIR = fromFileUrl(new URL("./src", import.meta.url));
const OUT_DIR = fromFileUrl(new URL("./transformed", import.meta.url));

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

/**
 * CSS-injection options, mirroring `vite-plugin-css-injected-by-js`'s
 * `BaseOptions` / `PluginConfiguration`.
 */
type InjectCodeOptions = {
  useStrictCSP?: boolean;
  attributes?: Record<string, string | (() => string)>;
};
type InjectCode = (cssCode: string, options: InjectCodeOptions) => string;
type InjectCodeFunction = (
  cssCode: string,
  options: InjectCodeOptions,
) => void;

type CssInjectionConfig = {
  /** Extra attributes set on the injected `<style>` element (e.g. `{ id: "app-css" }`). */
  attributes?: Record<string, string | (() => string)>;
  /** Replace the default injection snippet entirely. */
  injectCode?: InjectCode;
  /** Provide injection as a function called at runtime. */
  injectCodeFunction?: InjectCodeFunction;
  /** Run `preRenderCSSCode` over the raw CSS before it is injected. */
  preRenderCSSCode?: (cssCode: string) => string;
  /** Prepend the injection code to the top of the module (vs. appended). */
  topExecutionPriority?: boolean;
  /** Set a nonce from `<meta property="csp-nonce">` on the injected style. */
  useStrictCSP?: boolean;
};

const cssInjectionConfig: CssInjectionConfig = {
  topExecutionPriority: true,
};

/**
 * Default browser-side injection snippet, ported verbatim from
 * `vite-plugin-css-injected-by-js`'s `defaultInjectCode`.
 */
const defaultInjectCode: InjectCode = (cssCode, { useStrictCSP, attributes }) => {
  let attributesInjection = "";
  if (attributes) {
    for (const attribute in attributes) {
      const attributeValue =
        typeof attributes[attribute] === "function"
          ? attributes[attribute]()
          : attributes[attribute];
      attributesInjection += `elementStyle.setAttribute(${JSON.stringify(attribute)}, ${JSON.stringify(attributeValue)});`;
    }
  }
  return `try{if(typeof document != 'undefined'){const elementStyle = document.createElement('style');${
    useStrictCSP
      ? `elementStyle.nonce = document.head.querySelector('meta[property=csp-nonce]')?.content;`
      : ""
  }${attributesInjection}elementStyle.appendChild(document.createTextNode(${cssCode}));document.head.appendChild(elementStyle);}}catch(e){console.error('vite-plugin-css-injected-by-js', e);}`;
};

/**
 * Resolves the injection code, ported from
 * `vite-plugin-css-injected-by-js`'s `resolveInjectionCode`.
 */
function resolveInjectionCode(
  cssCode: string,
  injectCode: InjectCode | undefined,
  injectCodeFunction: InjectCodeFunction | undefined,
  { useStrictCSP, attributes }: InjectCodeOptions,
): string {
  const injectionOptions = { useStrictCSP, attributes };
  if (injectCodeFunction) {
    return `(${injectCodeFunction})(${cssCode}, ${JSON.stringify(injectionOptions)})`;
  }
  const injectFunction = injectCode || defaultInjectCode;
  return injectFunction(cssCode, injectionOptions);
}

/**
 * Builds the JS snippet that injects the given CSS at runtime.
 */
function buildCssInjectionCode(cssToInject: string): string {
  const cssCode = JSON.stringify(cssToInject.trim());
  return resolveInjectionCode(
    cssCode,
    cssInjectionConfig.injectCode,
    cssInjectionConfig.injectCodeFunction,
    {
      useStrictCSP: cssInjectionConfig.useStrictCSP,
      attributes: cssInjectionConfig.attributes,
    },
  );
}

/**
 * Inlines the CSS-injection snippet into the transformed module, ported from
 * `vite-plugin-css-injected-by-js`'s `buildOutputChunkWithCssInjectionCode`
 * (top-execution-priority path).
 */
function injectCssIntoCode(
  appCode: string,
  cssInjectionCode: string,
  topExecutionPriority: boolean,
): string {
  const cleanCode = appCode.replace(/\/\*\s*empty css\s*\*\//g, "");
  const singleLine = cssInjectionCode.replace(/\n/g, "");
  if (topExecutionPriority) {
    return `${singleLine}\n${cleanCode}`;
  }
  return `${cleanCode}\n${singleLine}`;
}

async function transformFile(
  sourceFile: string,
  outFile: string,
  writtenFiles: Set<string>,
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
    writtenFiles.add(outFile);

    if (typeof cssText === "string" && cssText.length > 0) {
      const cssToInject =
        typeof cssInjectionConfig.preRenderCSSCode === "function"
          ? cssInjectionConfig.preRenderCSSCode(cssText)
          : cssText;
      const injectionCode = buildCssInjectionCode(cssToInject);
      const injected = injectCssIntoCode(
        code,
        injectionCode,
        cssInjectionConfig.topExecutionPriority ?? true,
      );
      await Deno.writeTextFile(outFile, injected);
      return true;
    }

    await Deno.writeTextFile(outFile, code);
    return false;
  } finally {
    disposeEvalBroker(cache);
    cache.clear("all");
  }
}

/**
 * Removes any file in `OUT_DIR` that was not emitted during this run, then
 * prunes the now-empty directories left behind.
 */
async function removeStaleOutputs(writtenFiles: Set<string>): Promise<void> {
  const staleFiles: string[] = [];
  const staleDirs: string[] = [];

  for await (const entry of walk(OUT_DIR)) {
    if (!writtenFiles.has(entry.path)) {
      (entry.isDirectory ? staleDirs : staleFiles).push(entry.path);
    }
  }

  for (const file of staleFiles) {
    await Deno.remove(file);
  }
  for (const dir of staleDirs.sort((a, b) => b.length - a.length)) {
    try {
      await Deno.remove(dir);
    } catch {
      // directory may no longer be empty after stale files were removed
    }
  }

  if (staleFiles.length > 0) {
    console.log(`Removed ${staleFiles.length} stale file(s) from ${OUT_DIR}.`);
  }
}

async function main() {
  await ensureDir(OUT_DIR);

  const writtenFiles = new Set<string>();
  let injected = 0;

  for await (const entry of walk(SOURCE_DIR)) {
    if (!entry.isFile) {
      continue;
    }

    const rel = relative(SOURCE_DIR, entry.path);
    const outFile = join(OUT_DIR, rel);

    if (SOURCE_EXTENSIONS.has(extname(entry.path))) {
      if (await transformFile(entry.path, outFile, writtenFiles)) {
        injected += 1;
      }
      continue;
    }

    await ensureDir(dirname(outFile));
    await copy(entry.path, outFile, { overwrite: true });
    writtenFiles.add(outFile);
  }

  await removeStaleOutputs(writtenFiles);

  const format = new Deno.Command("deno", {
    args: ["fmt", OUT_DIR],
  });
  const { success } = await format.output();
  if (!success) {
    console.error(`Failed to format ${OUT_DIR} with deno fmt.`);
  }

  console.log(
    `Copied ${SOURCE_DIR} -> ${OUT_DIR} and injected CSS into ${injected} file(s).`,
  );
}

await main();

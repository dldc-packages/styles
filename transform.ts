/**
 * Build script for @dldc/styles.
 *
 * Copies every file under `src/` into `transformed/`, compiling the
 * vanilla-extract modules (files matching `.css.(js|ts|jsx|tsx)`) with
 * `@vanilla-extract/integration` so the `style()`/`createVar()`/... calls are
 * evaluated at build time and replaced with their generated identifiers.
 *
 * Module resolution is handled by Deno's module graph (`@jsr/deno__loader`),
 * the same machinery used by `@deno/vite-plugin`, so `jsr:`, `npm:`, `http(s):`
 * and import-map aliases (e.g. `@dldc/css-builder`) resolve correctly inside
 * the esbuild bundling step.
 *
 * The extracted CSS is not emitted as a standalone asset: it is inlined into
 * the transformed JavaScript using the injection logic from
 * `vite-plugin-css-injected-by-js` (see `defaultInjectCode`,
 * `resolveInjectionCode` and the top-execution-priority prepend in
 * `injectCssIntoCode`). When the module runs in the browser it creates a
 * `<style>` element and appends the CSS to the document.
 */

import { copy } from "@std/fs/copy";
import { ensureDir } from "@std/fs/ensure-dir";
import { walk } from "@std/fs/walk";
import { dirname, fromFileUrl, join, relative, toFileUrl } from "@std/path";
import {
  RequestedModuleType,
  ResolutionMode,
  ResolveError,
  Workspace,
} from "@jsr/deno__loader";
import * as esbuild from "esbuild";

const ROOT_DIR = fromFileUrl(new URL(".", import.meta.url));
const SOURCE_DIR = fromFileUrl(new URL("./src", import.meta.url));
const OUT_DIR = fromFileUrl(new URL("./transformed", import.meta.url));

// `@vanilla-extract/integration` captures `process.env.NODE_ENV` at load time
// and later assigns it back to `process.env`; if it is `undefined` that
// triggers a Node `DEP0104` DeprecationWarning. Set it to a string first so
// the integration module must be imported dynamically (after this line).
process.env.NODE_ENV ??= "development";

const {
  cssFileFilter,
  processVanillaFile: processVanillaFileRaw,
  transform: vanillaTransform,
} = await import("@vanilla-extract/integration");

/** Reads the package name from `deno.json` (no `package.json` required). */
function getPackageName(): string {
  try {
    const denoJson = JSON.parse(
      Deno.readTextFileSync(join(ROOT_DIR, "deno.json")),
    );
    return typeof denoJson.name === "string" ? denoJson.name : "";
  } catch {
    return "";
  }
}

const PACKAGE_NAME = getPackageName();

const denoWorkspace = new Workspace({
  configPath: join(ROOT_DIR, "deno.json"),
});
const denoLoader = await denoWorkspace.createLoader();
const textDecoder = new TextDecoder();

/**
 * Resolves a module specifier through Deno's module graph, handling `jsr:`,
 * `npm:`, `http(s):` and import-map aliases. Returns a `file://`/`https://`
 * URL, or `null` when Deno cannot resolve it.
 */
async function resolveDenoId(
  id: string,
  importer: string | undefined,
  namespace: string,
): Promise<string | null> {
  let referrer: string | undefined;
  if (namespace === "deno") {
    referrer =
      importer && (importer.startsWith("file:") || /^https?:/.test(importer))
        ? importer
        : importer
        ? toFileUrl(importer).href
        : undefined;
  } else if (importer) {
    referrer = toFileUrl(importer).href;
  }

  try {
    let resolved = denoLoader.resolveSync(id, referrer, ResolutionMode.Import);
    // Bare `jsr:`/remote specifiers first need to be graphed as entrypoints
    // before they resolve to their final URL.
    if (
      resolved.startsWith("jsr:") ||
      resolved.startsWith("http:") ||
      resolved.startsWith("https:")
    ) {
      try {
        await denoLoader.addEntrypoints([resolved]);
      } catch {
        return null;
      }
      resolved = denoLoader.resolveSync(
        resolved,
        undefined,
        ResolutionMode.Import,
      );
    }
    return resolved;
  } catch (err) {
    if (err instanceof ResolveError) {
      return null;
    }
    throw err;
  }
}

/**
 * Rewrites relative import specifiers inside a remote module to absolute URLs
 * so esbuild's onResolve can route them back through the Deno loader.
 */
function rewriteRemoteImports(code: string, moduleUrl: string): string {
  const base = moduleUrl.slice(0, moduleUrl.lastIndexOf("/") + 1);
  return code.replace(
    /(from\s+|\bimport\s*\()(["'])(\.\.?\/[^"']+)\2/g,
    (_match, prefix, quote, specifier) =>
      `${prefix}${quote}${new URL(specifier, base).href}${quote}`,
  );
}

/** esbuild plugin that resolves Deno-specific specifiers via @deno/loader. */
function denoResolvePlugin(): esbuild.Plugin {
  return {
    name: "deno-resolve",
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        if (args.path.startsWith("@vanilla-extract")) {
          return { external: true };
        }
        if (args.path.startsWith("node:") || args.path.startsWith("npm:")) {
          return null;
        }
        const resolved = await resolveDenoId(
          args.path,
          args.importer,
          args.namespace,
        );
        if (!resolved) {
          return null;
        }
        if (resolved.startsWith("file:")) {
          return { path: fromFileUrl(resolved) };
        }
        return { path: resolved, namespace: "deno" };
      });

      build.onLoad({ filter: /.*/, namespace: "deno" }, async (args) => {
        const url = args.path;
        if (url.startsWith("file:")) {
          return { path: fromFileUrl(url) };
        }
        const result = await denoLoader.load(
          url,
          RequestedModuleType.Default,
        );
        if (result.kind === "external") {
          return null;
        }
        return {
          contents: rewriteRemoteImports(
            textDecoder.decode(result.code),
            url,
          ),
          loader: "js",
        };
      });
    },
  };
}

/**
 * Compilation options, mirroring the vanilla-extract rollup/vite plugins.
 */
type TransformConfig = {
  /**
   * Identifier formatting. "short" produces 7+ character hashes, "debug"
   * produces human-readable prefixes, or a custom function can be provided.
   * @default "short"
   */
  identifiers?: Parameters<typeof vanillaTransform>[0]["identOption"];
  /** Directory used as the esbuild working directory. @default project root */
  cwd?: string;
};

const transformConfig: TransformConfig = {
  identifiers: "short",
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

/** Sentinel emitted in place of each vanilla CSS import so it can be stripped. */
const VIRTUAL_CSS_MARKER = "import '__vanilla_css_inline__';";

/**
 * Default browser-side injection snippet, ported verbatim from
 * `vite-plugin-css-injected-by-js`'s `defaultInjectCode`.
 */
const defaultInjectCode: InjectCode = (
  cssCode,
  { useStrictCSP, attributes },
) => {
  let attributesInjection = "";
  if (attributes) {
    for (const attribute in attributes) {
      const attributeValue = typeof attributes[attribute] === "function"
        ? attributes[attribute]()
        : attributes[attribute];
      attributesInjection += `elementStyle.setAttribute(${
        JSON.stringify(attribute)
      }, ${JSON.stringify(attributeValue)});`;
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
    return `(${injectCodeFunction})(${cssCode}, ${
      JSON.stringify(injectionOptions)
    })`;
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

/**
 * Compiles a single vanilla-extract file, collects the extracted CSS and
 * returns the module code with the CSS inlined.
 */
async function processVanillaFile(
  filePath: string,
): Promise<{ code: string; hasCss: boolean }> {
  const identOption = transformConfig.identifiers ?? "short";
  const cwd = transformConfig.cwd ?? ROOT_DIR;

  const source = await compileFile(filePath, cwd, identOption);

  let cssAccum = "";
  const output = await processVanillaFileRaw({
    source,
    filePath,
    identOption,
    serializeVirtualCssPath: ({ source: css }) => {
      cssAccum += css;
      return VIRTUAL_CSS_MARKER;
    },
  });

  const code = output.replace(
    new RegExp(`^${VIRTUAL_CSS_MARKER}\n?`, "gm"),
    "",
  );
  const hasCss = cssAccum.length > 0;

  if (hasCss) {
    const cssToInject =
      typeof cssInjectionConfig.preRenderCSSCode === "function"
        ? cssInjectionConfig.preRenderCSSCode(cssAccum)
        : cssAccum;
    const injectionCode = buildCssInjectionCode(cssToInject);
    const injected = injectCssIntoCode(
      code,
      injectionCode,
      cssInjectionConfig.topExecutionPriority ?? true,
    );
    return { code: injected, hasCss: true };
  }

  return { code, hasCss: false };
}

/**
 * Bundles a vanilla-extract file with esbuild, injecting the file scope via
 * `@vanilla-extract/integration`'s `transform`. This replicates
 * `@vanilla-extract/integration`'s `compile()` without requiring a
 * `package.json` — the package name is taken from `deno.json` instead.
 */
async function compileFile(
  filePath: string,
  cwd: string,
  identOption: NonNullable<TransformConfig["identifiers"]>,
): Promise<string> {
  const result = await esbuild.build({
    entryPoints: [filePath],
    metafile: true,
    bundle: true,
    external: ["@vanilla-extract"],
    platform: "node",
    write: false,
    plugins: [
      {
        name: "vanilla-extract-filescope",
        setup(build) {
          build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
            const originalSource = await Deno.readTextFile(path);
            const transformed = await vanillaTransform({
              source: originalSource,
              filePath: path,
              rootPath: build.initialOptions.absWorkingDir ?? cwd,
              packageName: PACKAGE_NAME,
              identOption,
            });
            return {
              contents: transformed,
              loader: /\.(ts|tsx)$/i.test(path) ? "ts" : undefined,
              resolveDir: dirname(path),
            };
          });
        },
      },
      denoResolvePlugin(),
    ],
    absWorkingDir: cwd,
  });

  const { outputFiles } = result;
  if (!outputFiles || outputFiles.length !== 1) {
    throw new Error("Invalid child compilation");
  }

  return outputFiles[0].text;
}

async function transformFile(
  sourceFile: string,
  outFile: string,
  writtenFiles: Set<string>,
): Promise<boolean> {
  const { code, hasCss } = await processVanillaFile(sourceFile);

  await ensureDir(dirname(outFile));
  writtenFiles.add(outFile);
  await Deno.writeTextFile(outFile, code);
  return hasCss;
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

    if (cssFileFilter.test(entry.path)) {
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

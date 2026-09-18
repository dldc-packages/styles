// deno-lint-ignore-file ban-types
import type { TDesignLength } from "./types.ts";

export function parseSize(size: TDesignLength | (string & {})): number {
  if (typeof size === "number") {
    return size;
  }
  const base = parseInt(size, 10);
  const rest = (size.match(/[_x]*$/)?.[0] ?? "")
    .split("")
    .map((char, index) => {
      if (char === "x") return 1 / Math.pow(2, index + 1);
      return 0;
    })
    .reduce((a, b) => a + b, 0);
  return base + (base < 0 ? -rest : rest);
}

export function parseMaybeSize(
  size: TDesignLength | (string & {}) | null | undefined,
): number | null {
  if (size === null || size === undefined) {
    return null;
  }
  return parseSize(size);
}

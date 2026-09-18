// deno-lint-ignore-file ban-types
import { clamp } from "../../utils/math.ts";
import { parseSize } from "./parse.ts";
import type { TDesignLength } from "./types.ts";

export function sizeToRem(size: TDesignLength | (string & {})): number {
  const parsedSize = typeof size === "number" ? size : parseSize(size);
  return (parsedSize * 4) / 16;
}

export function sizeToRemString(size: TDesignLength | (string & {})): string {
  return `${sizeToRem(size)}rem`;
}

export function maybeSizeToRemString(
  size: TDesignLength | (string & {}) | null | undefined,
): string | null {
  if (size === null || size === undefined) {
    return null;
  }
  return `${sizeToRem(size)}rem`;
}

export function sizeToFontSize(size: TDesignLength | (string & {})): string {
  const lineHeightRem = sizeToRem(size);
  const fontSizeRem = lineHeightRem -
    0.56 * Math.exp(-Math.pow(1.76 - lineHeightRem, 2) / Math.pow(0.8, 2));
  const fontSizeRemRounded = Math.round(fontSizeRem * 16) / 16; // Round to 2px
  return `${fontSizeRemRounded}rem`;
}

export function roundToHalf(value: number): number {
  const valRounded = Math.round(value * 2) / 2;
  return clamp(valRounded, 0, Infinity);
}

export function roundToQuarter(value: number): number {
  const valRounded = Math.round(value * 4) / 4;
  return clamp(valRounded, 0, Infinity);
}

export function resolveSmallRounded(height: number): boolean {
  return height <= 4;
}

export function clampHeightRatio(value: number): number {
  return clamp(value, 0.1, 1);
}

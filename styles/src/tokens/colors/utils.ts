import { colorsVars } from "./colors.css.ts";
import type { TColor } from "./colors.ts";

export function opacity(colorVar: string, value: number): string {
  return `color-mix(in oklab, ${colorVar} ${value.toFixed()}%, transparent)`;
}

export type TMapColors<Val> = {
  [C in keyof TColor]: TColor[C] extends Record<string, string>
    ? { [K in keyof TColor[C]]: Val }
    : Val;
};

export function mapColorsVars<Val>(
  mapper: (colVar: string) => Val,
): TMapColors<Val> {
  return mapColorsVarsInternal(colorsVars, mapper) as TMapColors<Val>;
}

export function mapColorsVarsInternal<Val>(
  input: Record<string, any>,
  mapper: (colVar: string) => Val,
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in input) {
    const value = input[key];

    if (typeof value === "string") {
      result[key] = mapper(value);
    } else {
      result[key] = mapColorsVarsInternal(value, (colVar) => mapper(colVar));
    }
  }

  return result;
}

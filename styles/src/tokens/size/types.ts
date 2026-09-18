import type { IntRange } from "type-fest";

type L1 = "x";
type L2 = `x${L1 | ""}` | `_${L1}`;
type L3 = `x${L2 | ""}` | `_${L2}`;

export type TDesignLength = `${"" | "-"}${IntRange<0, 100>}${"" | L3}` | number;

// Specific sizes with more restricted ranges
export type TDesignSize = `${IntRange<2, 15>}${"" | L1}` | number;
export type TDesignRounded =
  | `${IntRange<0, 5>}${"" | L3}`
  | `${IntRange<5, 10>}${"" | L1}`
  | number;
export type TDesignPadding =
  | `${IntRange<0, 5>}${"" | L2}`
  | `${IntRange<5, 10>}${"" | L1}`
  | number;

import { type ComplexStyleRule, styleVariants } from "@vanilla-extract/css";
import type { TFontWeight } from "../../tokens/typography/index.ts";
import { withLayer } from "../../utils/layer.ts";

export const fontWeightVariantsClass = styleVariants(
  {
    thin: withLayer({ fontWeight: 100 }),
    extralight: withLayer({ fontWeight: 200 }),
    light: withLayer({ fontWeight: 300 }),
    normal: withLayer({ fontWeight: 400 }),
    medium: withLayer({ fontWeight: 500 }),
    semibold: withLayer({ fontWeight: 600 }),
    bold: withLayer({ fontWeight: 700 }),
    extrabold: withLayer({ fontWeight: 800 }),
    black: withLayer({ fontWeight: 900 }),
  } satisfies Record<TFontWeight, ComplexStyleRule>,
);

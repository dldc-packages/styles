import { style } from "@vanilla-extract/css";
import {
  colorsVars,
  NEUTRAL_COLOR_SHADES,
  opacity,
  type TNeutralColorShade,
} from "../../tokens/colors.ts";
import { sizeToRemString } from "../../tokens/size/utils.ts";
import { withLayer } from "../../utils/layer.ts";

export const paperBaseClass = style(
  withLayer({
    // overflow: "hidden",
    borderWidth: sizeToRemString("0__x"),
    borderColor: opacity(colorsVars.white, 10),
  }),
);

export const paperClass = Object.fromEntries(
  NEUTRAL_COLOR_SHADES.map((key) => {
    return [
      key,
      style([
        paperBaseClass,
        withLayer({ backgroundColor: colorsVars.neutral[key] }),
      ]),
    ];
  }),
) as Record<TNeutralColorShade, string>;

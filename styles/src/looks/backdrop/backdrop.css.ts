import { style } from "@vanilla-extract/css";
import { colorsVars } from "../../tokens/colors/colors.css.ts";
import { opacity } from "../../tokens/colors/utils.ts";
import { sizeToRemString } from "../../tokens/size/utils.ts";
import { withLayer } from "../../utils/layer.ts";

export const backdropClass = style(
  withLayer({
    position: "fixed",
    inset: 0,
    backgroundColor: opacity(colorsVars.black, 30),
    backdropFilter: `blur(${sizeToRemString(1)})`,
  }),
);

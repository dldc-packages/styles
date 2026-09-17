import { style } from "@vanilla-extract/css";
import { colorsVars } from "../../tokens/colors/colors.css.ts";
import { sizeToRemString } from "../../tokens/size/utils.ts";
import { withLayer } from "../../utils/layer.ts";

export const tooltipClass = style(
  withLayer({
    borderRadius: sizeToRemString("2"),
    backgroundColor: colorsVars.neutral[900],
    paddingTop: sizeToRemString("1x"),
    paddingBottom: sizeToRemString("1x"),
    paddingLeft: sizeToRemString("3"),
    paddingRight: sizeToRemString("3"),
  }),
);

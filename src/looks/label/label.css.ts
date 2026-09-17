import { style } from "@vanilla-extract/css";
import { colorsVars } from "../../tokens/colors/colors.css.ts";
import { sizeToRemString } from "../../tokens/size/utils.ts";
import { withLayer } from "../../utils/layer.ts";

export const labelClass = style(
  withLayer({
    fontWeight: "semibold",
    color: colorsVars.neutral[400],
    marginBottom: sizeToRemString("0x"),
    marginLeft: sizeToRemString("0x"),
  }),
);

export const labelDisabledClass = style(
  withLayer({
    color: colorsVars.neutral[500],
  }),
);

import { style } from "@vanilla-extract/css";
import { sizeVar } from "../../tokens/variables/variables.css.ts";
import { withLayer } from "../../utils/layer.ts";

export const sizeMinSizeClass = style(
  withLayer({
    minWidth: sizeVar,
    minHeight: sizeVar,
  }),
);

export const sizeMinHeightClass = style(
  withLayer({
    minHeight: sizeVar,
  }),
);

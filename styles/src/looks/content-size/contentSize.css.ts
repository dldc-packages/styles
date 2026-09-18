import * as css from "@dldc/css-builder";
import { style } from "@vanilla-extract/css";
import { contentSizeVar } from "../../tokens/variables.css.ts";
import { withLayer } from "../../utils/layer.ts";

export const contentSizeLineHeightClass = style(
  withLayer({
    lineHeight: contentSizeVar,
    fontSize: css.serialize(css.multiply(contentSizeVar, 0.88)),
  }),
);

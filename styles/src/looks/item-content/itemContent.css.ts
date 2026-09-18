import * as css from "@dldc/css-builder";
import { style, styleVariants } from "@vanilla-extract/css";
import { withLayer } from "../../utils/layer.ts";
import { paddingVar } from "../padding/index.ts";

export const itemContentLayoutClass = style(
  withLayer({
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
    gap: paddingVar,
  }),
);

export const itemContentStartPaddingClass = styleVariants({
  icon: withLayer({ paddingLeft: paddingVar }),
  text: withLayer({
    paddingLeft: css.serialize(css.multiply(paddingVar, 1.5)),
  }),
  none: withLayer({ paddingLeft: 0 }),
});

export const itemContentEndPaddingClass = styleVariants({
  icon: withLayer({ paddingRight: paddingVar }),
  text: withLayer({
    paddingRight: css.serialize(css.multiply(paddingVar, 1.5)),
  }),
  none: withLayer({ paddingRight: 0 }),
});

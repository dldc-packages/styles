import { style } from "@vanilla-extract/css";
import { _placeholder } from "../../utils/conditions.ts";
import { withLayer } from "../../utils/layer.ts";

export const itemInputContentClass = style(
  withLayer({
    outline: "none",
    alignSelf: "stretch",
    flex: "1",
    selectors: {
      [_placeholder]: {
        opacity: 0.6,
      },
    },
  }),
);

import { style } from "@vanilla-extract/css";
import { _after, _before } from "../../utils/conditions.ts";

import { withLayer } from "../../utils/layer.ts";

export const itemClass = style(
  withLayer({
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    outline: "none",
    position: "relative",

    selectors: {
      // Used for focus and highlight border
      [_after]: {
        borderRadius: "inherit",
        ["cornerShape" as any]: "inherit",
        pointerEvents: "none",
        content: "''",
        position: "absolute",
        inset: 0,
      },
      // Used for visual border for input and surface variants
      [_before]: {
        borderRadius: "inherit",
        ["cornerShape" as any]: "inherit",
        pointerEvents: "none",
        content: "''",
        position: "absolute",
        inset: 0,
      },
    },
  }),
);

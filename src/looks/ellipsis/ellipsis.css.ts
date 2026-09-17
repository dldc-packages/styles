import { style } from "@vanilla-extract/css";
import { withLayer } from "../../utils/layer.ts";

export const ellipsisClass = style(
  withLayer({
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  }),
);

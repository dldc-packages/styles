import { style } from "@vanilla-extract/css";
import { withLayer } from "../../utils/layer.ts";
import { roundedVar } from "./index.ts";

export const roundedBorderRadiusClass = style(
  withLayer({
    borderRadius: roundedVar,
    ["cornerShape" as any]: "superellipse(1.5)",
  }),
);

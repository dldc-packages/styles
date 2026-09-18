import { recipe } from "@vanilla-extract/recipes";
import { withLayer } from "../../utils/layer.ts";

export const stackClass = recipe({
  base: withLayer({ display: "flex" }),
  variants: {
    direction: {
      column: withLayer({ flexDirection: "column" }),
      row: withLayer({ flexDirection: "row" }),
    },
    align: {
      start: withLayer({ alignItems: "flex-start" }),
      center: withLayer({ alignItems: "center" }),
      end: withLayer({ alignItems: "flex-end" }),
      stretch: withLayer({ alignItems: "stretch" }),
    },
    justify: {
      start: withLayer({ justifyContent: "flex-start" }),
      center: withLayer({ justifyContent: "center" }),
      end: withLayer({ justifyContent: "flex-end" }),
      between: withLayer({ justifyContent: "space-between" }),
      around: withLayer({ justifyContent: "space-around" }),
    },
  },
  defaultVariants: {
    direction: "column",
    align: "stretch",
  },
});

import { style } from "@vanilla-extract/css";
import { sizeToRemString } from "../../tokens/size/utils.ts";
import { withLayer } from "../../utils/layer.ts";

export const loadingBlockClass = style(
  withLayer({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: sizeToRemString("3"),
    paddingBlock: sizeToRemString("6"),
  }),
);

export const loadingTextClass = style(
  withLayer({
    textTransform: "uppercase",
    letterSpacing: "wider",
    // textStyle: "4",
    fontWeight: "semibold",
    paddingLeft: sizeToRemString("3"),
  }),
);

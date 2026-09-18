import { style } from "@vanilla-extract/css";
import { contentSizeVar } from "../../tokens/variables/variables.css.ts";
import { withLayer } from "../../utils/layer.ts";

export const checkboxClass = style(
  withLayer({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: contentSizeVar,
    height: contentSizeVar,
  }),
);

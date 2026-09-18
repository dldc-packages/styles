import { style } from "@vanilla-extract/css";

import { withLayer } from "../../utils/layer.ts";

export const mlAuto = style(
  withLayer({
    marginLeft: "auto",
  }),
);

export const mrAuto = style(
  withLayer({
    marginRight: "auto",
  }),
);

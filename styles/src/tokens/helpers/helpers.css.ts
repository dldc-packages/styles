import { style } from "@vanilla-extract/css";

export const layer = "dldc.ui-core.helpers";

export const srOnlyClass = style({
  "@layer": {
    [layer]: {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: "0",
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      borderWidth: "0",
    },
  },
});

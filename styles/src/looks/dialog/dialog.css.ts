import {
  createVar,
  globalStyle,
  style,
  styleVariants,
} from "@vanilla-extract/css";
import { sizeToRemString } from "../../tokens/size/utils.ts";
import { withLayer } from "../../utils/layer.ts";
import { paddingVar } from "../padding/index.ts";

export const insetVar = createVar("inset");

export const dialogRootClass = style(
  withLayer({
    position: "fixed",
    inset: "0",
    overflow: "hidden",
    zIndex: 50,
    pointerEvents: "none",
  }),
);

export const dialogRootScrollableVariantsClass = styleVariants({
  scrollable: withLayer({
    overflowY: "auto",
  }),
  noScrollable: withLayer({}),
});

export const dialogPositionerClass = style(
  withLayer({
    width: "100%",
    display: "grid",
    padding: insetVar,
    gridTemplateRows: `1fr`,
    gridTemplateColumns: `auto`,

    vars: {
      [insetVar]: sizeToRemString("3"),
    },
  }),
);

globalStyle(
  `${dialogPositionerClass} > *`,
  withLayer({
    placeSelf: "center",
    width: "100%",
    pointerEvents: "all",
  }),
);

globalStyle(
  `${dialogRootScrollableVariantsClass.scrollable} > ${dialogPositionerClass}`,
  withLayer({
    minHeight: "100%",
  }),
);

globalStyle(
  `${dialogRootScrollableVariantsClass.noScrollable} > ${dialogPositionerClass}`,
  withLayer({
    height: "100%",
  }),
);

globalStyle(
  `${dialogRootScrollableVariantsClass.noScrollable} > ${dialogPositionerClass} > *`,
  withLayer({
    maxHeight: "100%",
  }),
);

export const dialogSizeVariantsClass = styleVariants({
  sm: withLayer({ maxWidth: 460 }),
  md: withLayer({ maxWidth: 600 }),
  lg: withLayer({ maxWidth: 800 }),
  xl: withLayer({ maxWidth: 1200 }),
  full: withLayer({}),
});

export const dialogLayoutClass = style(
  withLayer({
    display: "flex",
    flexDirection: "column",
    gap: paddingVar,
    padding: paddingVar,
  }),
);

export const dialogFooterClass = style(
  withLayer({
    display: "inline-flex",
    justifyContent: "flex-end",
    gap: paddingVar,
  }),
);

import { globalStyle, style } from "@vanilla-extract/css";
import {
  colorsVars,
  dynamicColorVars,
} from "../../tokens/colors/colors.css.ts";
import { opacity } from "../../tokens/colors/utils.ts";
import { sizeToRemString } from "../../tokens/size/utils.ts";
import {
  _activeItem,
  _after,
  _disabledActiveItem,
  _focusWithinVisible,
  isAfter,
  isDisabled,
  isFocusWithin,
  isHover,
} from "../../utils/conditions.ts";
import { withLayer } from "../../utils/layer.ts";
import { paddingVar } from "../padding/index.ts";

export const listWrappertClass = style(
  withLayer({
    display: "flex",
    flexDirection: "column",
  }),
);

export const selectPopoverClass = style(
  withLayer({
    zIndex: 50,
    outline: "none",
    padding: paddingVar,
    // Used for focus ring
    [_after]: {
      borderRadius: "inherit",
      ["cornerShape" as any]: "inherit",
      pointerEvents: "none",
      content: "''",
      position: "absolute",
      inset: 0,
    },
    [_focusWithinVisible + isAfter]: {
      borderColor: colorsVars.neutral[500],
      borderWidth: sizeToRemString("0_x"),
    },
  }),
);

export const listItemClass = style(
  withLayer({
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    outline: "none",
    position: "relative",
    color: dynamicColorVars[200],

    selectors: {
      [_activeItem]: {
        backgroundColor: dynamicColorVars[600],
        color: dynamicColorVars[200],
      },
      [_disabledActiveItem]: {
        color: opacity(dynamicColorVars[200], 40),
        backgroundColor: "transparent",
      },
    },
  }),
);

// Make icon slightly transparent by default, fully opaque on hover/focus
globalStyle(
  `${listItemClass} [data-item-main-icon]`,
  withLayer({ opacity: 0.6 }),
);
globalStyle(
  `${listItemClass}${isHover} [data-item-main-icon]`,
  withLayer({ opacity: 1 }),
);
globalStyle(
  `${listItemClass}${isFocusWithin} [data-item-main-icon]`,
  withLayer({ opacity: 1 }),
);
// Don't change icon opacity when disabled
globalStyle(
  `${listItemClass}${isHover}${isDisabled} [data-item-main-icon]`,
  withLayer({ opacity: 0.6 }),
);

// Icons don't like opacity on fill color, so instead we set color + opacity
globalStyle(
  `${listItemClass}${isDisabled} svg`,
  withLayer({ color: dynamicColorVars[200], opacity: 0.4 }),
);

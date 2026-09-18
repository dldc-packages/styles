import {
  createVar,
  globalStyle,
  style,
  styleVariants,
} from "@vanilla-extract/css";
import {
  _after,
  _before,
  _betweenChild,
  _firstChild,
  _lastChild,
  isBefore,
} from "../../utils/conditions.ts";
import { DIRECTIONS } from "../../utils/directions.ts";
import { withLayer } from "../../utils/layer.ts";
import { sizeToRemString } from "../../tokens/size/utils.ts";

export const separatorWidthVar = createVar(
  { syntax: "length", initialValue: sizeToRemString("0_x"), inherits: true },
  "separator-width",
);

export const itemGroupClass = style(
  withLayer({
    display: "inline-flex",
    position: "relative",
    isolation: "isolate",
  }),
);

/**
 * Ensure children have higher z-index than separators
 * This is important when the after/border is on top of the separator
 */
globalStyle(
  `${itemGroupClass} ${_firstChild}`,
  withLayer({ zIndex: 2, position: "relative" }),
);
globalStyle(
  `${itemGroupClass} ${_betweenChild}`,
  withLayer({ zIndex: 2, position: "relative" }),
);
globalStyle(
  `${itemGroupClass} ${_lastChild}`,
  withLayer({ zIndex: 2, position: "relative" }),
);

export const itemGroupDirectionClass = styleVariants({
  horizontal: withLayer({ flexDirection: "row" }),
  vertical: withLayer({ flexDirection: "column" }),
});

DIRECTIONS.forEach(
  ({ direction, TopRight, BottomRight, BottomLeft, TopLeft, Right, Left }) => {
    const baseClass = itemGroupDirectionClass[direction];
    // Remove radius inside
    globalStyle(
      `${baseClass} ${_firstChild}`,
      withLayer({
        [`border${TopRight}Radius`]: 0,
        [`border${BottomRight}Radius`]: 0,
      }),
    );
    globalStyle(
      `${baseClass} ${_betweenChild}`,
      withLayer({ borderRadius: 0 }),
    );
    globalStyle(
      `${baseClass} ${_lastChild}`,
      withLayer({
        [`border${TopLeft}Radius`]: 0,
        [`border${BottomLeft}Radius`]: 0,
      }),
    );

    // Remove border inside
    globalStyle(
      `${baseClass} ${_firstChild + isBefore}`,
      withLayer({ [`border${Right}Width`]: 0 }),
    );
    globalStyle(
      `${baseClass} ${_betweenChild + isBefore}`,
      withLayer({ [`border${Left}Width`]: 0, [`border${Right}Width`]: 0 }),
    );
    globalStyle(
      `${baseClass} ${_lastChild + isBefore}`,
      withLayer({ [`border${Left}Width`]: 0 }),
    );
  },
);

export const itemGroupSeparatorClass = style(
  withLayer({
    alignSelf: "stretch",
    position: "relative",
    zIndex: 1,
    selectors: {
      // Used to reproduce border
      [_before]: {
        pointerEvents: "none",
        content: "''",
        position: "absolute",
        inset: 0,
      },

      // Used to create the actual separator
      [_after]: {
        pointerEvents: "none",
        content: "''",
        position: "absolute",
        inset: 0,
      },
    },
  }),
);

export const itemGroupSeparatorDirectionClass = styleVariants({
  horizontal: withLayer({ width: separatorWidthVar }),
  vertical: withLayer({ height: separatorWidthVar }),
});

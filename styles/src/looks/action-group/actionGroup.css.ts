import {
  type ComplexStyleRule,
  createVar,
  globalStyle,
  style,
  styleVariants,
} from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { colorsVars, dynamicColorVars, opacity } from "../../tokens/colors.ts";
import { sizeToRemString } from "../../tokens/size.ts";
import type { TDesignVariant } from "../../tokens/variants.ts";
import {
  _after,
  _before,
  _betweenChild,
  _firstChild,
  _lastChild,
  isAfter,
  isHover,
} from "../../utils/conditions.ts";
import { DIRECTIONS } from "../../utils/directions.ts";
import { varsWithLayer, withLayer } from "../../utils/layer.ts";
import { borderWidthVar } from "../action/action.css.ts";
import {
  itemGroupDirectionClass,
  itemGroupSeparatorClass,
  separatorWidthVar,
} from "../item-group/itemGroup.css.ts";

export const partialSeparatorPaddingVar = createVar(
  { syntax: "length", initialValue: sizeToRemString("0x"), inherits: true },
  "partial-separator-padding",
);

export const actionGroupClass = style(withLayer({}));

/**
 * Set separator width based on variant
 */
export const actionGroupVariantsClass = styleVariants(
  {
    solid: varsWithLayer({
      [separatorWidthVar]: sizeToRemString("0_x"),
    }),
    surface: varsWithLayer({
      [separatorWidthVar]: sizeToRemString("0__x"),
    }),
    subtle: varsWithLayer({
      [separatorWidthVar]: sizeToRemString("0_x"),
    }),
    ghost: varsWithLayer({
      [separatorWidthVar]: sizeToRemString("0_x"),
    }),
    input: varsWithLayer({
      [separatorWidthVar]: sizeToRemString("0_x"),
    }),
  } satisfies Record<TDesignVariant, ComplexStyleRule>,
);

export const actionGroupSeparatorVariantClass = styleVariants(
  {
    none: {},
    full: {},
    partial: {},
  } satisfies Record<"none" | "partial" | "full", ComplexStyleRule>,
);

export const actionGroupSeparatorActionVariantClass = styleVariants(
  {
    solid: withLayer({
      backgroundColor: dynamicColorVars[600],
      selectors: {
        [_after]: {
          backgroundColor: opacity(colorsVars.black, 20),
        },
      },
    }),
    surface: withLayer({
      backgroundColor: opacity(colorsVars.white, 5),
      selectors: {
        [_after]: {
          backgroundColor: opacity(colorsVars.white, 10),
        },
      },
    }),
    subtle: {},
    ghost: {},
    input: withLayer({
      backgroundColor: opacity(colorsVars.black, 15),
      selectors: {
        [_after]: {
          backgroundColor: opacity(colorsVars.black, 30),
        },
      },
    }),
  } satisfies Record<TDesignVariant, ComplexStyleRule>,
);

DIRECTIONS.forEach(
  ({ direction, Top, Bottom, right, left, top, bottom, height }) => {
    const baseClass = itemGroupDirectionClass[direction];

    // Align focus border with separator outside
    globalStyle(
      `${baseClass} ${_firstChild + isAfter}`,
      withLayer({ [right]: calc.negate(separatorWidthVar) }),
    );
    globalStyle(
      `${baseClass} ${_betweenChild + isAfter}`,
      withLayer({
        [left]: calc.negate(separatorWidthVar),
        [right]: calc.negate(separatorWidthVar),
      }),
    );
    globalStyle(
      `${baseClass} ${_lastChild + isAfter}`,
      withLayer({ [left]: calc.negate(separatorWidthVar) }),
    );

    // Custom style for partial separator
    globalStyle(
      `${baseClass} > ${actionGroupSeparatorVariantClass.partial}`,
      withLayer({
        [_after]: {
          [top]: partialSeparatorPaddingVar,
          [bottom]: partialSeparatorPaddingVar,
        },
      }),
    );

    // Reproduce border when partial
    globalStyle(
      `${baseClass} > ${actionGroupSeparatorVariantClass.partial}`,
      withLayer({
        [_before]: {
          [`border${Top}Width`]: borderWidthVar,
          [`border${Bottom}Width`]: borderWidthVar,
        },
      }),
    );

    // Special case for subtle where the separator is a hole.
    globalStyle(
      `${baseClass} > ${actionGroupSeparatorVariantClass.partial}${actionGroupSeparatorActionVariantClass.subtle}`,
      withLayer({
        [_before]: {
          [top]: 0,
          [bottom]: "auto",
          [height]: partialSeparatorPaddingVar,
        },
        [_after]: {
          [bottom]: 0,
          [top]: "auto",
          [height]: partialSeparatorPaddingVar,
        },
      }),
    );
  },
);

globalStyle(
  `${actionGroupSeparatorVariantClass.partial}${actionGroupSeparatorActionVariantClass.surface}`,
  withLayer({
    [_before]: {
      borderColor: opacity(colorsVars.white, 10),
    },
  }),
);

globalStyle(
  `${actionGroupSeparatorVariantClass.partial}${actionGroupSeparatorActionVariantClass.input}`,
  withLayer({
    [_before]: {
      borderColor: opacity(colorsVars.black, 30),
    },
  }),
);

globalStyle(
  `${actionGroupSeparatorVariantClass.partial}${actionGroupSeparatorActionVariantClass.subtle}`,
  withLayer({
    [_before]: {
      backgroundColor: opacity(colorsVars.white, 5),
    },
    [_after]: {
      backgroundColor: opacity(colorsVars.white, 5),
    },
  }),
);

/**
 * Special case for Surface variant: when an action is hovered rigth before of after the separator,
 * the separator :before should have same color as the hovered action border
 */
globalStyle(
  `${actionGroupSeparatorActionVariantClass.surface}:has(+ ${
    itemGroupSeparatorClass + isHover
  })`,
  withLayer({ backgroundColor: opacity(colorsVars.white, 10) }),
);

globalStyle(
  `${
    itemGroupSeparatorClass + isHover
  } + ${actionGroupSeparatorActionVariantClass.surface}`,
  withLayer({ backgroundColor: opacity(colorsVars.white, 10) }),
);

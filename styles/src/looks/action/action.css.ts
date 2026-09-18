import {
  type ComplexStyleRule,
  createVar,
  fallbackVar,
  style,
  styleVariants,
} from "@vanilla-extract/css";
import {
  colorsVars,
  dynamicColorVars,
} from "../../tokens/colors/colors.css.ts";
import type { TPaletteColor } from "../../tokens/colors/types.ts";
import { opacity } from "../../tokens/colors/utils.ts";
import { sizeToRemString } from "../../tokens/size/utils.ts";
import type { TDesignVariant } from "../../tokens/variants/index.ts";
import {
  _after,
  _before,
  _disabledHover,
  _focusWithin,
  _focusWithinVisible,
  _hover,
  isAfter,
} from "../../utils/conditions.ts";
import { varsWithLayer, withLayer } from "../../utils/layer.ts";

export const borderWidthVar = createVar("border-width");
export const focusBorderWidthVar = createVar("focus-border-width");
export const focusBorderColorVar = createVar("focus-border-color");
export const backgroundColorVar = createVar("background-color");
export const textColorVar = createVar("text-color");
export const borderColorVar = createVar("border-color");

export const disabledTextColorVar = createVar("disabled-text-color");
export const disabledBackgroundColorVar = createVar(
  "disabled-background-color",
);

export const activeBackgroundColorVar = createVar("active-background-color");
export const activeTextColorVar = createVar("active-text-color");
export const focusBackgroundColorVar = createVar("focus-background-color");

export const actionClass = style(
  withLayer({
    backgroundColor: backgroundColorVar,
    color: fallbackVar(textColorVar, dynamicColorVars[200]),

    selectors: {
      // Used for focus and highlight border
      [_after]: {},
      // Used for visual border for input and surface variants
      [_before]: {
        borderWidth: borderWidthVar,
        borderColor: borderColorVar,
      },
    },
  }),
);

export const actionVariantsClass = styleVariants(
  {
    solid: varsWithLayer({
      [borderWidthVar]: sizeToRemString("0"),
      [backgroundColorVar]: dynamicColorVars[600],
      [textColorVar]: dynamicColorVars[100],
    }),
    surface: varsWithLayer({
      [borderWidthVar]: sizeToRemString("0__x"),
      [backgroundColorVar]: opacity(colorsVars.white, 5),
      [borderColorVar]: opacity(colorsVars.white, 10),
    }),
    subtle: varsWithLayer({
      [borderWidthVar]: sizeToRemString("0"),
      [backgroundColorVar]: opacity(colorsVars.white, 5),
    }),
    ghost: varsWithLayer({
      [borderWidthVar]: sizeToRemString("0"),
      [backgroundColorVar]: "transparent",
    }),
    input: varsWithLayer({
      [borderWidthVar]: sizeToRemString("0_x"),
      [backgroundColorVar]: opacity(colorsVars.black, 15),
      [borderColorVar]: opacity(colorsVars.black, 30),
    }),
  } satisfies Record<TDesignVariant, ComplexStyleRule>,
);

export const actionFocusVariantsClass = styleVariants(
  {
    solid: varsWithLayer({
      [focusBorderWidthVar]: sizeToRemString("0x"),
      [focusBackgroundColorVar]: dynamicColorVars[700],
    }),
    surface: varsWithLayer({
      [focusBorderWidthVar]: sizeToRemString("0_x"),
    }),
    subtle: varsWithLayer({
      [focusBorderWidthVar]: sizeToRemString("0_x"),
    }),
    ghost: varsWithLayer({
      [focusBorderWidthVar]: sizeToRemString("0_x"),
    }),
    input: varsWithLayer({
      [focusBorderWidthVar]: sizeToRemString("0_x"),
      [focusBorderColorVar]: opacity(dynamicColorVars[300], 40),
    }),
  } satisfies Record<TDesignVariant, ComplexStyleRule>,
);

// Set variable for each variant
export const actionDisabledVariantsClass = styleVariants(
  {
    solid: varsWithLayer({
      [disabledTextColorVar]: opacity(colorsVars.neutral[200], 60),
      [disabledBackgroundColorVar]: dynamicColorVars[800],
    }),
    surface: varsWithLayer({
      [disabledTextColorVar]: opacity(dynamicColorVars[200], 40),
      [disabledBackgroundColorVar]: opacity(colorsVars.white, 3),
    }),
    subtle: varsWithLayer({
      [disabledTextColorVar]: opacity(dynamicColorVars[200], 40),
      [disabledBackgroundColorVar]: opacity(colorsVars.white, 3),
    }),
    ghost: varsWithLayer({
      [disabledTextColorVar]: opacity(dynamicColorVars[200], 40),
      [disabledBackgroundColorVar]: "transparent",
    }),
    input: varsWithLayer({
      [disabledTextColorVar]: opacity(dynamicColorVars[200], 40),
      [disabledBackgroundColorVar]: opacity(colorsVars.black, 3),
    }),
  } satisfies Record<TDesignVariant, ComplexStyleRule>,
);

// Set variable for each variant
export const actionActiveVariantsClass = styleVariants(
  {
    solid: varsWithLayer({
      [activeBackgroundColorVar]: dynamicColorVars[500],
      [activeTextColorVar]: colorsVars.neutral[100],
    }),
    surface: varsWithLayer({
      [activeBackgroundColorVar]: opacity(colorsVars.white, 10),
      [activeTextColorVar]: dynamicColorVars[100],
    }),
    subtle: varsWithLayer({
      [activeBackgroundColorVar]: opacity(colorsVars.white, 10),
      [activeTextColorVar]: dynamicColorVars[100],
    }),
    ghost: varsWithLayer({
      [activeBackgroundColorVar]: opacity(colorsVars.white, 5),
      [activeTextColorVar]: dynamicColorVars[100],
    }),
    input: varsWithLayer({
      [activeBackgroundColorVar]: opacity(colorsVars.black, 5),
      [activeTextColorVar]: dynamicColorVars[100],
    }),
  } satisfies Record<TDesignVariant, ComplexStyleRule>,
);

export const actionInteractiveClass = style(
  withLayer({
    selectors: {
      [_focusWithinVisible + isAfter]: {
        borderColor: fallbackVar(focusBorderColorVar, colorsVars.neutral[300]),
        borderWidth: focusBorderWidthVar,
      },
      [_disabledHover]: {
        color: disabledTextColorVar,
        backgroundColor: disabledBackgroundColorVar,
      },
      [_hover]: {
        backgroundColor: activeBackgroundColorVar,
        color: activeTextColorVar,
      },
      [_focusWithin]: {
        backgroundColor: fallbackVar(
          focusBackgroundColorVar,
          activeBackgroundColorVar,
        ),
        color: activeTextColorVar,
      },
    },
  }),
);

// Make icon slightly transparent by default, fully opaque on hover/focus
// globalStyle(`${actionClass} [data-item-main-icon]`, withLayer({ opacity: 0.6 }));
// globalStyle(`${actionInteractiveClass}${isHover} [data-item-main-icon]`, withLayer({ opacity: 1 }));
// globalStyle(`${actionInteractiveClass}${isFocusWithin} [data-item-main-icon]`, withLayer({ opacity: 1 }));
// globalStyle(`${actionInteractiveClass}${isHover}${isDisabled} [data-item-main-icon]`, withLayer({ opacity: 0.6 }));
// // SVG don't like opacity on fill color, so instead we set color + opacity
// globalStyle(
//   `${actionInteractiveClass}${isDisabled} svg`,
//   withLayer({
//     color: colorsVars.neutral[200],
//     opacity: 0.4,
//   }),
// );

export const actionHighlightClass = style(
  withLayer({
    selectors: {
      [_after]: {
        borderWidth: sizeToRemString("0x"),
      },
    },
  }),
);

function afterWithLayer<const Value>(rule: Value) {
  return withLayer({
    selectors: {
      [_after]: rule,
    },
  });
}

export const actionHighlightColorsClass = styleVariants(
  {
    red: afterWithLayer({ borderColor: colorsVars.red[600] }),
    orange: afterWithLayer({ borderColor: colorsVars.orange[600] }),
    amber: afterWithLayer({ borderColor: colorsVars.amber[600] }),
    yellow: afterWithLayer({ borderColor: colorsVars.yellow[600] }),
    lime: afterWithLayer({ borderColor: colorsVars.lime[600] }),
    green: afterWithLayer({ borderColor: colorsVars.green[600] }),
    emerald: afterWithLayer({ borderColor: colorsVars.emerald[600] }),
    teal: afterWithLayer({ borderColor: colorsVars.teal[600] }),
    cyan: afterWithLayer({ borderColor: colorsVars.cyan[600] }),
    sky: afterWithLayer({ borderColor: colorsVars.sky[600] }),
    blue: afterWithLayer({ borderColor: colorsVars.blue[600] }),
    indigo: afterWithLayer({ borderColor: colorsVars.indigo[600] }),
    violet: afterWithLayer({ borderColor: colorsVars.violet[600] }),
    purple: afterWithLayer({ borderColor: colorsVars.purple[600] }),
    fuchsia: afterWithLayer({ borderColor: colorsVars.fuchsia[600] }),
    pink: afterWithLayer({ borderColor: colorsVars.pink[600] }),
    rose: afterWithLayer({ borderColor: colorsVars.rose[600] }),
    gray: afterWithLayer({ borderColor: colorsVars.gray[600] }),
    slate: afterWithLayer({ borderColor: colorsVars.slate[600] }),
    neutral: afterWithLayer({ borderColor: colorsVars.neutral[600] }),
    stone: afterWithLayer({ borderColor: colorsVars.stone[600] }),
    zinc: afterWithLayer({ borderColor: colorsVars.zinc[600] }),
  } satisfies Record<TPaletteColor, ComplexStyleRule>,
);

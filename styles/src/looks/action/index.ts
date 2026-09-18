import { clsx } from "clsx";
import { dynamicColor } from "../../tokens/colors/colors.css.ts";
import type { TPaletteColor } from "../../tokens/colors/types.ts";
import type { TDesignVariant } from "../../tokens/variants/index.ts";
import { look, type TLook } from "../../utils/look.ts";
import {
  actionActiveVariantsClass,
  actionClass,
  actionDisabledVariantsClass,
  actionFocusVariantsClass,
  actionHighlightClass,
  actionHighlightColorsClass,
  actionInteractiveClass,
  actionVariantsClass,
} from "./action.css.ts";

interface TCreateActionLookParams {
  variant: TDesignVariant;
  color: TPaletteColor | undefined;
  hoverVariant: TDesignVariant;
  interactive: boolean;
  highlightColor: TPaletteColor;
  highlighted: boolean;
}

export function createActionLook(params: TCreateActionLookParams): TLook {
  const {
    variant,
    color,
    interactive,
    hoverVariant,
    highlightColor,
    highlighted,
  } = params;

  return look(
    clsx(
      actionClass,
      actionVariantsClass[variant],
      interactive && actionInteractiveClass,
      interactive && actionActiveVariantsClass[hoverVariant],
      interactive && actionFocusVariantsClass[hoverVariant],
      interactive && actionDisabledVariantsClass[variant],
      color && dynamicColor[color],
      highlighted && actionHighlightClass,
      highlighted && actionHighlightColorsClass[highlightColor],
    ),
  );
}

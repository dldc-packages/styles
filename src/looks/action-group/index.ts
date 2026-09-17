import { assignInlineVars } from "@vanilla-extract/dynamic";
import { clsx } from "clsx";
import { dynamicColor } from "../../tokens/colors/colors.css.ts";
import type { TPaletteColor } from "../../tokens/colors/types.ts";
import type { TDesignVariant } from "../../tokens/variants/index.ts";
import { look, type TLook } from "../../utils/look.ts";
import { actionVariantsClass } from "../action/action.css.ts";
import { paddingVar } from "../padding/index.ts";
import {
  actionGroupClass,
  actionGroupSeparatorActionVariantClass,
  actionGroupSeparatorVariantClass,
  actionGroupVariantsClass,
  partialSeparatorPaddingVar,
} from "./actionGroup.css.ts";

export interface TCreateActionGroupLookParams {
  color: TPaletteColor | undefined;
  variant: TDesignVariant;
}

export function createActionGroupLook(
  params: TCreateActionGroupLookParams,
): TLook {
  const { color, variant } = params;

  return look(
    clsx(
      actionGroupClass,
      actionVariantsClass[variant], // This will only set variants variables
      actionGroupVariantsClass[variant],
      color && dynamicColor[color],
    ),
  );
}

export interface TCreateActionGroupSeparatorLookParams {
  variant: TDesignVariant;
  separatorVariant: "none" | "partial" | "full";
}

export function createActionGroupSeparatorLook(
  params: TCreateActionGroupSeparatorLookParams,
): TLook {
  const { variant, separatorVariant } = params;

  return look(
    clsx(
      actionGroupSeparatorActionVariantClass[variant],
      actionGroupSeparatorVariantClass[separatorVariant],
    ),
    assignInlineVars({
      [partialSeparatorPaddingVar]: paddingVar,
    }),
  );
}

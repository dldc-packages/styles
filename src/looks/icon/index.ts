import { assignInlineVars } from "@vanilla-extract/dynamic";
import clsx from "clsx";
import type { TDesignSize } from "../../tokens/size/types.ts";
import { sizeToRemString } from "../../tokens/size/utils.ts";
import { contentSizeVar } from "../../tokens/variables/variables.css.ts";
import { look, type TLook } from "../../utils/look.ts";
import { iconClass, iconDisplayVariantClass } from "./icon.css.ts";

export interface TCreateIconLookParams {
  size: TDesignSize | undefined;
  inline: boolean;
}

export function createIconLook(params: TCreateIconLookParams): TLook {
  const { size, inline } = params;
  return look(
    clsx(iconClass, iconDisplayVariantClass[inline ? "inlineFlex" : "flex"]),
    assignInlineVars({
      [contentSizeVar]: size ? sizeToRemString(size) : undefined,
    }),
  );
}

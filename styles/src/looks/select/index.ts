import { clsx } from "clsx";
import { dynamicColor } from "../../tokens/colors/colors.css.ts";
import type { TPaletteColor } from "../../tokens/colors/types.ts";
import { look, type TLook } from "../../utils/look.ts";
import {
  listItemClass,
  listWrappertClass,
  selectPopoverClass,
} from "./select.css.ts";

export { listWrappertClass };

interface TCreateSelectItemLookParams {
  color: TPaletteColor | undefined;
  disabled: boolean;
}

export function createSelectItemLook(
  params: TCreateSelectItemLookParams,
): TLook {
  const { color } = params;

  return look(clsx(listItemClass, color && dynamicColor[color]));
}

export function createSelectPopoverLook(): TLook {
  return look(clsx(selectPopoverClass, listWrappertClass));
}

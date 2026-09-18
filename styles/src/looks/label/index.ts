import clsx from "clsx";
import { look, type TLook } from "../../utils/look.ts";
import { labelClass, labelDisabledClass } from "./label.css.ts";

export interface TCreateLabelLookParams {
  disabled: boolean;
}

export function createLabelLook(
  { disabled = false }: TCreateLabelLookParams,
): TLook {
  // const [contentClass, contentInline] = contentSize(4);

  return look(
    clsx(
      labelClass,
      // contentClass,
      disabled && labelDisabledClass,
    ),
    // { ...contentInline },
  );
}

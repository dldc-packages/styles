import { clsx } from "clsx";
import { look, type TLook } from "../../utils/look.ts";
import {
  itemGroupClass,
  itemGroupDirectionClass,
  itemGroupSeparatorClass,
  itemGroupSeparatorDirectionClass,
} from "./itemGroup.css.ts";

export interface TCreateItemGroupLookParams {
  direction: "horizontal" | "vertical";
}

export function createItemGroupLook(params: TCreateItemGroupLookParams): TLook {
  const { direction } = params;

  return look(clsx(itemGroupClass, itemGroupDirectionClass[direction]));
}

export interface TCreateItemGroupSeparatorLookParams {
  direction: "horizontal" | "vertical";
}

export function createItemGroupSeparatorLook(
  params: TCreateItemGroupSeparatorLookParams,
): TLook {
  const { direction } = params;

  return look(
    clsx(itemGroupSeparatorClass, itemGroupSeparatorDirectionClass[direction]),
  );
}

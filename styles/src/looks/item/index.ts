import { clsx } from "clsx";
import { look, mergeLooks, type TLook } from "../../utils/look.ts";
import {
  contentSizeLineHeightClass,
  createContentSizeLook,
} from "../content-size/index.ts";
import { createPaddingLook } from "../padding/index.ts";
import {
  createRoundedLook,
  roundedBorderRadiusClass,
} from "../rounded/index.ts";
import { createSizeLook, sizeMinHeightClass } from "../size/index.ts";
import { itemClass } from "./item.css.ts";

export interface TCreateItemLookParams {
  padding: number | null;
  paddingVarName: string;
  parentPaddingVarName: string | null;
  defaultPadding: number;

  rounded: number | "autoFromSize" | null;
  roundedVarName: string | null;
  parentRoundedVarName: string | null;
  defaultRounded: number;

  size: null | number | "autoFromContent";
  sizeVarName: string;
  parentSizeVarName: string | null;
  defaultSize: number;

  contentSize: null | number | "parentSize";
  contentSizeVarName: string;
  parentContentSizeVarName: string | null;
}

export function createItemLook(params: TCreateItemLookParams): TLook {
  const {
    paddingVarName,
    roundedVarName,
    sizeVarName,
    contentSizeVarName,
    defaultRounded,
    parentRoundedVarName,
    parentPaddingVarName,
    rounded,
    contentSize,
    padding,
    defaultPadding,
    defaultSize,
    parentContentSizeVarName,
    parentSizeVarName,
    size,
  } = params;
  return mergeLooks(
    look(
      clsx(
        itemClass,
        roundedBorderRadiusClass,
        sizeMinHeightClass,
        contentSizeLineHeightClass,
      ),
    ),
    createRoundedLook({
      defaultRounded,
      parentPaddingVarName,
      parentRoundedVarName,
      rounded,
      roundedVarName,
      sizeVarName,
    }),
    createPaddingLook({
      defaultPadding,
      paddingVarName,
      sizeVarName,
      contentSize,
      contentSizeVarName,
      padding,
    }),
    createSizeLook({
      defaultSize,
      parentContentSizeVarName,
      parentPaddingVarName,
      parentSizeVarName,
      paddingVarName,
      size,
      sizeVarName,
      contentSizeVarName,
    }),
    createContentSizeLook({
      contentSize,
      contentSizeVarName,
      paddingVarName,
      sizeVarName,
      parentContentSizeVarName,
    }),
  );
}

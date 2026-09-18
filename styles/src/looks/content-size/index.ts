import * as css from "@dldc/css-builder";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { UNIT_IN_REM_STRING } from "../../tokens/size/constants.ts";
import { contentSizeVar } from "../../tokens/variables.css.ts";
import { look, type TLook } from "../../utils/look.ts";
import { MIN_AUTO_HEIGHT } from "../size/index.ts";
import { contentSizeLineHeightClass } from "./contentSize.css.ts";

export { contentSizeLineHeightClass };

interface TContentSizeLookParams {
  contentSizeVarName: string;
  contentSize: null | number | "parentSize";
  parentContentSizeVarName: string | null;
  paddingVarName: string;
  sizeVarName: string;
}

export function createContentSizeLook({
  contentSizeVarName,
  contentSize,
  paddingVarName,
  sizeVarName,
  parentContentSizeVarName,
}: TContentSizeLookParams): TLook {
  return look(
    null,
    assignInlineVars({
      [contentSizeVarName]: css.maybeSerialize(
        contentSizeVarValue({
          contentSize,
          paddingVarName,
          sizeVarName,
          parentContentSizeVarName,
        }),
      ),
      [contentSizeVar]: css.serialize(
        css.multiply(css.var(contentSizeVarName), UNIT_IN_REM_STRING),
      ),
    }),
  );
}

interface TContentSizeVarValueParams {
  contentSize: null | number | "parentSize";
  sizeVarName: string;
  paddingVarName: string;
  parentContentSizeVarName: string | null;
}

function contentSizeVarValue({
  contentSize,
  sizeVarName,
  paddingVarName,
  parentContentSizeVarName,
}: TContentSizeVarValueParams) {
  if (contentSize === "parentSize") {
    if (parentContentSizeVarName) {
      return css.var(parentContentSizeVarName);
    }
    return undefined;
  }
  if (typeof contentSize === "number") {
    return css.number(contentSize);
  }
  contentSize satisfies null;
  // Auto compute from size and padding
  return css.max(
    MIN_AUTO_HEIGHT,
    css.subtract(
      css.var(sizeVarName),
      css.multiply(css.var(paddingVarName), 2),
    ),
  );
}

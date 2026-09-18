import * as css from "@dldc/css-builder";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import clsx from "clsx";
import {
  UNIT_IN_REM,
  UNIT_IN_REM_STRING,
} from "../../tokens/size/constants.ts";
import type { TFontWeight } from "../../tokens/typography.ts";
import { contentSizeVar } from "../../tokens/variables.css.ts";
import { look, mergeLooks, type TLook } from "../../utils/look.ts";
import type { CSSProperties } from "../../utils/types.ts";
import { contentSizeLineHeightClass } from "../content-size/contentSize.css.ts";
import { fontWeightVariantsClass } from "./typography.css.ts";

export { fontWeightVariantsClass };

export interface TCreateTypographyLookParams {
  contentSize: null | number | "parentSize";
  fontSize: number | null;
  fontWeight: TFontWeight | null;
  contentSizeVarName: string;
  parentContentSizeVarName: string | null;
  defaultContentSize: number;
}

export function createTypographyLook({
  fontWeight,
  contentSize,
  contentSizeVarName,
  parentContentSizeVarName,
  defaultContentSize,
  fontSize,
}: TCreateTypographyLookParams): TLook {
  return mergeLooks(
    look(
      clsx(fontWeight ? fontWeightVariantsClass[fontWeight] : null),
      typographyFontSizeInlineStyles({ fontSize }),
    ),
    typographyContentSizeLook({
      contentSize,
      contentSizeVarName,
      parentContentSizeVarName,
      defaultContentSize,
      fontSize,
    }),
  );
}

interface TTypographyContentSizeLookParams {
  contentSize: null | number | "parentSize";
  contentSizeVarName: string;
  parentContentSizeVarName: string | null;
  defaultContentSize: number;
  fontSize: number | null;
}

function typographyContentSizeLook({
  contentSize,
  contentSizeVarName,
  parentContentSizeVarName,
  defaultContentSize,
  fontSize,
}: TTypographyContentSizeLookParams): TLook | null {
  const contentSizeVarVal = contentSizeVarValue({
    contentSize,
    parentContentSizeVarName,
    defaultContentSize,
    fontSize,
  });
  if (contentSizeVarVal === null) {
    return null;
  }
  return look(
    contentSizeLineHeightClass,
    assignInlineVars({
      [contentSizeVarName]: css.serialize(contentSizeVarVal),
      [contentSizeVar]: css.serialize(
        css.multiply(css.var(contentSizeVarName), UNIT_IN_REM_STRING),
      ),
    }),
  );
}

interface TypographyFontSizeInlineStylesParams {
  fontSize: number | null;
}

function typographyFontSizeInlineStyles(
  { fontSize }: TypographyFontSizeInlineStylesParams,
): CSSProperties {
  if (!fontSize) {
    return {};
  }

  return assignInlineVars({
    fontSize: css.serialize(
      css.multiply(css.number(fontSize), UNIT_IN_REM_STRING),
    ),
  });
}

export interface TContentSizeVarValueParams {
  contentSize: null | number | "parentSize";
  parentContentSizeVarName: string | null;
  defaultContentSize: number;
  fontSize: number | null;
}

function contentSizeVarValue({
  contentSize,
  parentContentSizeVarName,
  defaultContentSize,
  fontSize,
}: TContentSizeVarValueParams) {
  if (contentSize === "parentSize") {
    // Note: this is the default behavior of typography: take contentSize of parent content-size.
    // we handle this case only for sake of completeness
    if (parentContentSizeVarName) {
      return css.var(parentContentSizeVarName);
    }
    return null;
  }
  if (typeof contentSize === "number") {
    return css.number(contentSize);
  }
  contentSize satisfies null;
  if (fontSize !== null) {
    // Compute contentSize (lineHeight) from fontSize
    return css.roundDown(css.multiply(css.number(fontSize), 1.4), UNIT_IN_REM);
  }

  if (!parentContentSizeVarName) {
    return css.number(defaultContentSize);
  }
  return css.var(parentContentSizeVarName);
}

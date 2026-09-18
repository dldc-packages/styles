import * as css from "@dldc/css-builder";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import {
  UNIT_IN_REM,
  UNIT_IN_REM_STRING,
} from "../../tokens/size/constants.ts";
import { paddingVar } from "../../tokens/variables.css.ts";
import { look, type TLook } from "../../utils/look.ts";
import { paddingSpacing } from "./padding.css.ts";

export { paddingSpacing, paddingVar };

const SIZE_PADDING_PITCH = 0.36;
const SIZE_PADDING_OFFSET = -0.74;
const MIN_AUTO_PADDING = 0;

export interface TCreatePaddingLookParams {
  paddingVarName: string;
  padding: number | null;
  defaultPadding: number;
  contentSize: null | number | "parentSize";
  sizeVarName: string | null;
  contentSizeVarName: string | null;
}

export function createPaddingLook(options: TCreatePaddingLookParams): TLook {
  const {
    paddingVarName,
    padding,
    defaultPadding,
    sizeVarName,
    contentSize,
    contentSizeVarName,
  } = options;

  return look(
    null,
    assignInlineVars({
      [paddingVarName]: css.maybeSerialize(
        paddingVarValue({
          padding,
          sizeVarName,
          contentSize,
          contentSizeVarName,
          defaultPadding,
        }),
      ),
      [paddingVar]: css.serialize(
        css.multiply(css.var(paddingVarName), UNIT_IN_REM_STRING),
      ),
    }),
  );
}

interface TPaddingVarValueParams {
  padding: number | null;
  defaultPadding: number;
  sizeVarName: string | null;
  contentSize: null | number | "parentSize";
  contentSizeVarName: string | null;
}

function paddingVarValue({
  padding,
  sizeVarName,
  contentSize,
  contentSizeVarName,
  defaultPadding,
}: TPaddingVarValueParams) {
  if (padding !== null) {
    return css.number(padding);
  }
  if (!sizeVarName) {
    return css.number(defaultPadding);
  }
  // If contentSize is set, padding is computed from it
  if (contentSize !== null && sizeVarName && contentSizeVarName) {
    return css.max(
      MIN_AUTO_PADDING,
      css.roundDown(
        css.divide(
          css.subtract(css.var(sizeVarName), css.var(contentSizeVarName)),
          2,
        ),
        UNIT_IN_REM,
      ),
    );
  }
  // Otherwise, padding is computed from size
  return css.max(
    MIN_AUTO_PADDING,
    css.roundDown(
      css.add(
        SIZE_PADDING_OFFSET,
        css.multiply(SIZE_PADDING_PITCH, css.var(sizeVarName)),
      ),
      UNIT_IN_REM,
    ),
  );
}

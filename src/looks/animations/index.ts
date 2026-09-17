import { assignInlineVars } from "@vanilla-extract/dynamic";
import { look, type TLook } from "../../utils/look.ts";
import { spinClass, traceClass, traceLengthVar } from "./animations.css.ts";

export { spinClass };

export interface TTraceAnimationLookParams {
  length: number;
}

export function createTraceAnimationLook(
  params: TTraceAnimationLookParams,
): TLook {
  const { length } = params;
  return look(
    traceClass,
    assignInlineVars({ [traceLengthVar]: `${length}px` }),
  );
}

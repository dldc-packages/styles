import { look, type TLook } from "../../utils/index.ts";
import { stackClass } from "./stack.css.ts";

export { stackClass };

export type TCreateStackLookParams = Parameters<typeof stackClass>[0];

export function createHStackLook(
  params?: Omit<TCreateStackLookParams, "direction">,
): TLook {
  return look(stackClass({ direction: "row", ...params }));
}

export function createVStackLook(
  params?: Omit<TCreateStackLookParams, "direction">,
): TLook {
  return look(stackClass({ direction: "column", ...params }));
}

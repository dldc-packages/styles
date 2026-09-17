import { look, type TLook } from "../../utils/look.ts";
import { ellipsisClass } from "./ellipsis.css.ts";

export function createEllipsisLook(): TLook {
  return look(ellipsisClass);
}

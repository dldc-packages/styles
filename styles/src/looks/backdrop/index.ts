import { look, type TLook } from "../../utils/look.ts";
import { backdropClass } from "./backdrop.css.ts";

export function createBackdropLook(): TLook {
  return look(backdropClass);
}

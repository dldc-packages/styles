import { look, type TLook } from "../../utils/look.ts";
import { itemInputContentClass } from "./itemInput.css.ts";

export function createItemInputLook(): TLook {
  return look(itemInputContentClass);
}

import { look, type TLook } from "../../utils/look.ts";
import { checkboxClass } from "./checkbox.css.ts";

export function createCheckboxLook(): TLook {
  return look(checkboxClass);
}

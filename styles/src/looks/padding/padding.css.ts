import { styleVariants } from "@vanilla-extract/css";
import { withLayer } from "../../utils/layer.ts";
import { paddingVar } from "./index.ts";

export const paddingSpacing = styleVariants({
  paddingLeft: withLayer({ paddingLeft: paddingVar }),
  paddingRight: withLayer({ paddingRight: paddingVar }),
  paddingTop: withLayer({ paddingTop: paddingVar }),
  paddingBottom: withLayer({ paddingBottom: paddingVar }),
  paddingX: withLayer({ paddingLeft: paddingVar, paddingRight: paddingVar }),
  paddingY: withLayer({ paddingTop: paddingVar, paddingBottom: paddingVar }),
  padding: withLayer({ padding: paddingVar }),
  gap: withLayer({ gap: paddingVar }),
});

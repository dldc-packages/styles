import { colors } from "@dldc/styles/tokens/colors";
import createPlugin from "tailwindcss/plugin";

import { radius, sizes, spacing } from "./size.ts";

const plugin: any = createPlugin(
  (_api) => {
    return;
  },
  {
    theme: {
      colors,
      spacing,
      sizes,
      radius,
    },
  },
);

export default plugin;

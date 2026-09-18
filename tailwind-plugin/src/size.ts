import { serializeSizeFromPx } from "@dldc/styles/tokens/size";
import { paddingVar } from "@dldc/styles/tokens/variables";

import { buildSizeTokenMap, range } from "./utils.ts";

const RADIUS_VALUES = [0, 0.5, ...range(1, 16 - 1, 1)];

const SIZES_VALUES = [
  0,
  0.5,
  ...range(1, 16 - 1, 1),
  ...range(16, 40 - 1, 2),
  ...range(40, 80, 4),
];

const PX_SIZES_VALUES = [...range(80 + 1, 1024 + 1, 32)];

export const spacing = {
  ...buildSizeTokenMap(SIZES_VALUES, serializeSizeFromPx),
  paddingVar: paddingVar,
};

export const sizes = {
  ...buildSizeTokenMap(SIZES_VALUES, serializeSizeFromPx),
  ...buildSizeTokenMap(PX_SIZES_VALUES, (value) => `${value}px`),

  prose: { value: "65ch" },
  full: { value: "100%" },
  min: { value: "min-content" },
  max: { value: "max-content" },
  fit: { value: "fit-content" },
};

export const radius = {
  ...buildSizeTokenMap(RADIUS_VALUES, serializeSizeFromPx),
  full: { value: "9999px" },
};

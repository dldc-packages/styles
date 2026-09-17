import { createVar } from "@vanilla-extract/css";

/**
 * Represent the current size value in unit
 */
export const sizeVar = createVar({
  syntax: "<length>",
  inherits: true,
  initialValue: "0",
}, "size");

/**
 * Represent the size of the content in unit
 */
export const contentSizeVar = createVar({
  syntax: "<length>",
  inherits: true,
  initialValue: "1",
}, "content-size");

/**
 * Represent the current rounded value in unit
 */
export const roundedVar = createVar({
  syntax: "<length>",
  inherits: true,
  initialValue: "0",
}, "rounded");

/**
 * Represent the current padding value in unit
 */
export const paddingVar = createVar({
  syntax: "<length>",
  inherits: true,
  initialValue: "0",
}, "padding");

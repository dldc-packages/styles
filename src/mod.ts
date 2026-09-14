import { css } from "dx-styles";

export const base: string = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
});

export const button: string = css(base, {
  minHeight: "32px",
  paddingInline: "12px",
  borderRadius: "999px",
});

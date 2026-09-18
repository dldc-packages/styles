import type { CSSProperties } from "./types.ts";

export interface TLook {
  className?: string;
  style?: CSSProperties;
}

export function look(
  className: string | null | undefined,
  style?: CSSProperties | null,
): TLook {
  return { className: className || undefined, style: style ?? undefined };
}

export function mergeLooks(
  ...looks: (TLook | null | false | 0 | undefined)[]
): TLook {
  let className: string | undefined = undefined;
  let style: CSSProperties | undefined = undefined;

  for (const look of looks) {
    if (!look) continue;

    if (look.className) {
      className = className ? className + " " + look.className : look.className;
    }

    if (look.style) {
      style = { ...(style ?? {}), ...look.style };
    }
  }

  return { className, style };
}

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type SerializedTextMetrics = Mutable<TextMetrics>;

export type Font = FontProperties | Pick<CSSStyleDeclaration, "font"> | string;

export interface FontProperties {
  fontFamily: string;
  fontSize: number;
  fontStretch?: string;
  fontStyle?: string;
  fontVariant?: string;
  fontWeight?: number | string;
  lineHeight?: number;
}

let defaultFont: string;
let context: CanvasRenderingContext2D;

const DEFAULT_FONT_SIZE_UNIT = "px";

export function measureText(text: string, font?: Font): SerializedTextMetrics {
  const normalizedText = normalizeString(text);
  const resolvedFont = getFont(font);

  const context = getContext();
  context.font = resolvedFont ?? defaultFont;
  const metrics = context.measureText(normalizedText);

  return serializeTextMetrics(metrics);
}

function serializeTextMetrics(metrics: TextMetrics) {
  const plainMetrics = {} as SerializedTextMetrics;

  for (
    const property of Object.getOwnPropertyNames(
      Object.getPrototypeOf(metrics),
    ) as (keyof TextMetrics)[]
  ) {
    const value = metrics[property];

    if (isNumber(value)) {
      plainMetrics[property] = value;
    }
  }

  return plainMetrics;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function getContext() {
  if (isUndefined(context)) {
    const canvas = document.createElement("canvas");

    canvas.width = 1;
    canvas.height = 1;

    context = canvas.getContext("2d") as CanvasRenderingContext2D;
    defaultFont = context.font;
  }

  return context;
}

function isUndefined<T>(value: T | undefined): value is undefined {
  return value === undefined;
}

function normalizeString(string: string) {
  return string.replace(/\r?\n|\r/gm, "").trim();
}

function getFont(font?: Font) {
  if (isCSSStyleDeclaration(font as CSSStyleDeclaration)) {
    return (font as CSSStyleDeclaration).getPropertyValue("font");
  } else if (isString(font)) {
    return font;
  } else if (font) {
    return getFontProperties(font as FontProperties);
  } else {
    return undefined;
  }
}

function isCSSStyleDeclaration(value: unknown): value is CSSStyleDeclaration {
  return value instanceof CSSStyleDeclaration;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function getFontSizeWithLineHeight(fontSize: number, lineHeight?: number) {
  const fontSizeWithUnit = `${fontSize}${DEFAULT_FONT_SIZE_UNIT}`;

  return lineHeight ? `${fontSizeWithUnit}/${lineHeight}` : fontSizeWithUnit;
}

function getFontProperties({
  fontFamily,
  fontSize,
  fontStretch,
  fontStyle,
  fontVariant,
  fontWeight,
  lineHeight,
}: FontProperties) {
  if (!fontSize || !fontFamily) return;

  const font = [
    fontStyle,
    fontVariant,
    fontWeight,
    fontStretch,
    getFontSizeWithLineHeight(fontSize, lineHeight),
    fontFamily,
  ].filter(Boolean);

  return font.join(" ");
}

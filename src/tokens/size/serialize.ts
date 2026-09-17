export function serializeSize(size: number): string {
  const base = size >= 0 ? Math.floor(size) : Math.ceil(size);
  const baseStr = base.toFixed(0);
  const remainder = size % 1;
  if (remainder === 0) {
    return baseStr;
  }
  const remainderStr = remainder
    .toString(2)
    .replace(/^-?0\.?/, "")
    .replace(/0/g, "_")
    .replace(/1/g, "x");
  return baseStr + remainderStr;
}

export function serializeSizeFromPx(size: number): string {
  return serializeSize(size / 4);
}

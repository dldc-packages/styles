export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function powerValue(value: number, power: number): number {
  const powerClamped = clamp(power, 0, 1);
  return Math.pow(value + 1, powerClamped) - 1;
}

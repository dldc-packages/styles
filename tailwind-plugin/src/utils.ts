export function range(
  min: number,
  max: number,
  moduloFilter: number,
): number[] {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i).filter((
    value,
  ) => value % moduloFilter === 0);
}

export function buildSizeTokenMap(
  values: number[],
  formatKey: (value: number) => string,
): Record<string, string> {
  return Object.fromEntries(
    values.map((value) => [formatKey(value), `${value / 16}rem`]),
  );
}

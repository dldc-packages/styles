export function keysOfType<T>(obj: Record<keyof T, null>): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

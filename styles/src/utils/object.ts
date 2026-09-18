export function withoutUndefined<T extends Record<string, any>>(
  value: T,
): Partial<T> {
  const result: Record<string, any> = {};
  for (const key in value) {
    if (value[key] !== undefined) {
      result[key] = value[key];
    }
  }
  return result as Partial<T>;
}

export function pick<T extends string, Out>(
  value: T,
  options: Record<T, Out>,
): Out {
  return options[value];
}

export function pickBoolStrict<Out>(
  value: boolean,
  trueVal: Out,
  falseVal: Out,
): Out {
  return value === true ? trueVal : falseVal;
}

export function pickBool<Out>(
  value: boolean | undefined,
  trueVal: Out,
  falseVal: Out,
): Out | undefined {
  return value === true ? trueVal : value === false ? falseVal : undefined;
}

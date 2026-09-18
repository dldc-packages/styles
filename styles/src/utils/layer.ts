export const layer = "dldc.ui-styles";

export function withLayer<const Value>(rule: Value) {
  return { "@layer": { [layer]: rule } };
}

export function varsWithLayer(vars: Record<string, string>) {
  return withLayer({
    vars,
  });
}

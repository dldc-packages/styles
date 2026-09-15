try {
  if (typeof document != "undefined") {
    const elementStyle = document.createElement("style");
    elementStyle.appendChild(
      document.createTextNode(
        ".b18u7q2y{display:inline-flex;align-items:center;gap:8px;}\n.b1pl6ciq{display:inline-flex;align-items:center;gap:8px;min-height:32px;padding-inline:12px;border-radius:999px;}",
      ),
    );
    document.head.appendChild(elementStyle);
  }
} catch (e) {
  console.error("vite-plugin-css-injected-by-js", e);
}
export const base: string = "b18u7q2y";
export const button: string = "b1pl6ciq";

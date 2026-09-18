# @workspace/tools

Internal build tooling for the `@dldc/styles` package. Not published.

## transform

`tools/transform.ts` compiles the vanilla-extract modules in `../styles/src`
into plain JavaScript in `../styles/transformed`, inlining the extracted CSS
into the output.

Run it via the styles member task:

```sh
deno task --cwd=styles transform
```

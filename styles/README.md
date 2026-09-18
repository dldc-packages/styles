# @dldc/styles

A collection of styles and look utilities built with
[vanilla-extract](https://vanilla-extract.style/).

## Install

```sh
deno add jsr:@dldc/styles
```

## Development

The package ships compiled output in `transformed/` (vanilla-extract modules
evaluated into plain JavaScript with the CSS inlined). Rebuild it with:

```sh
deno task --cwd=styles transform
```

This runs the transform from the `tools/` member, reading `src/` and writing to
`transformed/`.

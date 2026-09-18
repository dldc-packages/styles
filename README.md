# styles monorepo

Deno workspace for the `@dldc/styles` package and its supporting tooling.

## Members

| Directory | Package            | Description                                             |
| --------- | ------------------ | ------------------------------------------------------- |
| `styles/` | `@dldc/styles`     | The styles library (vanilla-extract based).             |
| `tools/`  | `@workspace/tools` | Build tooling, including the vanilla-extract transform. |
| `docs/`   | `@workspace/docs`  | Documentation site (Vite).                              |

## Tasks

Run from the workspace root with `deno task`:

- `check` — format, type-check and lint the whole workspace.
- `deps:outdated` / `deps:update` — inspect or update dependencies.

Member-specific tasks run with `deno task --cwd=<member> <task>` (for example
`deno task --cwd=styles transform`).

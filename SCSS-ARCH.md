SCSS Architecture (quick note)

Purpose
- Provide a small, consistent pattern for organizing global SCSS across the project.

Layout
- src/styles/
  - _variables.scss  — global variables (colors, spacing, tokens)
  - _mixins.scss     — reusable mixins (accessibility helpers, shadows, etc.)
  - _base.scss       — global base styles and scaffolding that depend on variables/mixins
  - index.scss       — a single public API (uses @forward to expose what the rest of the app needs)

Usage
- In `src/styles.scss` we `@use './styles/index' as *;` to pull variables/mixins/base into the global stylesheet.
- For component-level styles, prefer encapsulated styles in the component's own scss file and `@use` the global index if you need variables/mixins.

Notes
- Use `@use` and `@forward` for Sass modules; do not use `@import` for internal SCSS modules.
- Keep external CSS imports (e.g., PrismJS themes) using plain `@import` since they are not Sass modules.
- `@use` must come before other rules in a stylesheet; place it at the top.

Component-level global utilities
- To avoid repetitive imports and make globals available, we've prepended `@use 'src/styles/index' as *;` to component-level SCSS files across the project.
- This makes variables and mixins available to component authors without extra setup.
- If a component is later extracted into a library or needs a different styling contract, remove the global `@use` and explicitly add a tailored import to avoid leaking global tokens.

Example (component scss)

@use 'src/styles/index' as *;

.button {
  background: $primary;
  @include card-shadow();
}

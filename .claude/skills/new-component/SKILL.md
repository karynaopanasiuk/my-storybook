---
name: new-component
description: Build a React + TypeScript + Tailwind component from a Figma component URL, styled only with the project's design tokens, with a Storybook story per state; stop for review in Storybook, then on the user's OK commit, push, open a PR and return the Chromatic review link. Use when the user runs /new-component with a Figma URL or asks to add a Figma component to Storybook.
argument-hint: "[figma-component-url]"
disable-model-invocation: true
---

# Skill: New component from Figma

When the user runs `/new-component <figma-url>` (for example
`/new-component https://www.figma.com/design/<fileKey>/<name>?node-id=2998-6996`).

The node id is the `node-id` query parameter, `2998-6996` -> `2998:6996`. The PascalCase `<Name>` is the
Figma component set name (ask if it is unclear, e.g. a Cyrillic "С" in "Сheckbox" becomes `Checkbox`).

## Steps

### 1. Read the Figma component (all variants, variables, modes)
1. Try the Figma MCP first: `get_metadata` and `get_variable_defs` on the node.
2. The Figma MCP on this account's Starter plan often returns "tool call limit". It also reads variables
   per node only and ignores modes. Then use the figmosha bridge (Figma plugin API), which reads everything:
   - `curl -s localhost:8787/status`. If it is down, start the `figmosha-bridge` launch config
     (`Design Engineer/.claude/launch.json`). If `plugin_connected` is false, ask the user to open the design
     system file in Figma Desktop and run Plugins > Development > Figmosha Bridge.
   - `node .claude/skills/new-component/scripts/inspect-figma.mjs <node-id> <scratchpad>/<name>.json`
     dumps properties, every variant and every layer with fills, strokes, radius, padding, gap, effects,
     variable modes and text styles. Each value shows its Figma variable, or `HARD` when it is not bound.
   - Icons: `node .claude/skills/new-component/scripts/export-svg.mjs <main-component-id>` (the `main` id
     in the dump). Put them in `src/components/<Name>/icons.tsx` with fills/strokes set to `currentColor`.
     Reuse an existing icon from another component folder when it is the same Figma component.
3. Summarize for the user: variant properties (e.g. Size × State), states, extra parts (label, hint,
   counter, icons).

### 2. Map every value to a token — ask when there is none
Tokens live in `tokens.json` (generated from Figma, never edit by hand) and are built into
`src/styles/tokens.css` (all variables), `tokens.modes.css` (Figma modes) and `tokens.theme.css`
(Tailwind v4 `@theme`). Use them like the existing components (`src/components/Input`, `Badge`,
`Checkbox`, `TextArea`):
- Colors: Tailwind theme utilities from the variable name, `Background/default` -> `bg-background-default`,
  `Text/placeholder` -> `text-text-placeholder`, primitive `grey/5` -> `text-grey-5`.
- Sizes: `h-[var(--spacing-24)]`, `px-[var(--spacing-10)]`; radius `rounded-ds-md` (`--radius-ds-*`);
  stroke `border-[length:var(--stroke-sm)]`; text `[font:var(--typography-body-sm-regular)]`;
  shadows `shadow-[var(--shadow-focus-shine)]`.
- Color variants and states that Figma does with a variable mode (Error = `Red-danger`, hint = `Grey`,
  badge colors) use `data-theme="<mode>"` (`red-danger`, `grey`, `green-success`, …), not new colors.
- **No hex, rgb or px color values in the component.** If a color has no token, stop and ask.
- If a size, radius, font or opacity is `HARD` in Figma and has no matching token, **stop and list them**
  (value, where it is used, nearest tokens) and ask: keep the Figma value as a documented exception,
  round to a token, or add a variable in Figma. Don't decide alone. The project so far keeps Figma values in
  a `NO_TOKEN` object at the top of the component. Fractional strokes like 0.667 or 1.125px are
  Figma scaling artifacts: use the 1px `stroke-sm` token and say so.
- If the spec is ambiguous (states not in the request, extra parts, what a prop should do), ask.

### 3. Build `src/components/<Name>/<Name>.tsx`
- Named export, `forwardRef` to the native element, props extend the native attributes (`Omit` clashes
  such as `size`), variants as string-literal unions with `Record<Variant, string>` class maps.
- Every Figma state: hover → `hover:` / `enabled:hover:`, focus → `focus-within:` or `focus-visible:`,
  disabled → `disabled:` + the `disabled` prop, error → an `error` prop + `aria-invalid`.
- Use native elements (`input`, `textarea`, `button`) so keyboard, forms and a11y work; label with
  `htmlFor` + `useId`, hint via `aria-describedby`.
- Watch Tailwind specificity: `disabled:` is ordered before `checked:` and `hover:`, so combine
  (`disabled:checked:`, `enabled:hover:`); two utilities for the same property on one element conflict.

### 4. Build `src/components/<Name>/<Name>.stories.tsx`
- `title: "Components/<Name>"`, `tags: ["autodocs"]`, `args` with sensible defaults, `argTypes` with a
  control for every prop (`inline-radio` for unions, `select` + `mapping` for ReactNode like icons).
- One story per Figma state (Default, Hover can't be forced, Focused via `play` + `userEvent`, Filled,
  Error, Disabled…), plus a Sizes story and, if there is a color prop, a Colors story.
- In `play`, compare colors with token probe elements, never hex. Don't create DOM nodes inside
  `waitFor` (it re-runs on every mutation and loops forever).

### 5. Check it, start Storybook, then STOP
1. `npx tsc -b --noEmit` (the 2 errors in `src/stories/*` from `storybook init` are pre-existing),
   `npx oxlint src/components/<Name>`, and `grep` the component for hex/rgb colors.
2. Start Storybook with the `my-storybook` launch config (`npm run storybook`, port 6006). New story files
   are often not picked up by a running server: if `/index.json` has no `components-<name>` entries,
   restart it.
3. Compare every Figma variant with the rendered result: open the story iframes with `&args=`
   (`/iframe.html?id=components-<name>--<story>&viewMode=story&args=size:md;error:!true`), read computed
   styles and compare size, radius, colors, borders, shadows, padding and fonts with the dump. The preview
   pane is often hidden: CSS transitions freeze there, so set `transition: none` before measuring states,
   and programmatic focus may not trigger `:focus-visible`.
4. Run the story tests: `npx vitest --project storybook --run` in the background, read the log, then kill
   `node_modules/.bin/vitest` and `chrome-headless-shell` (the process does not exit on its own).
5. Give the user the Storybook URL (`http://localhost:6006/?path=/docs/components-<name>--docs`), the
   verification results and every decision you made, then **stop and wait for their "OK"**.
   Do not commit before that.

### 6. On "OK": commit, push, PR
1. Work on a branch `feature/<name>-component` created from an up-to-date `main` (never commit to `main`).
2. `git add src/components/<Name>` (and only files that belong to the component),
   `git commit -m "feat: add <Name>"`, `git push -u origin feature/<name>-component`,
   `gh pr create --fill` (with `--base main`).

### 7. Chromatic review link
- The `Chromatic` GitHub workflow publishes every push with the `CHROMATIC_PROJECT_TOKEN` secret, so
  don't run it twice: wait for the run (`gh run list --workflow chromatic.yml --branch <branch>`,
  `gh run watch <id>`), then `gh pr checks <pr>`. It lists the Storybook URL and the "UI Tests" build
  link with the changes to accept.
- Only if the workflow is missing or failed, run `npx chromatic --exit-zero-on-changes` with
  `CHROMATIC_PROJECT_TOKEN` from the environment. Never write the token into a file or command history.
- Return the PR link, the Storybook URL and the Chromatic build link. Tell the user that new stories must be
  accepted there before merging.

## Output format
After step 5: the Storybook URL, a table of Figma variants vs rendered result (all match / what differs),
the list of token exceptions and decisions, and the question "OK to commit?".
After step 7: PR link, Chromatic Storybook URL, Chromatic build link and how many changes wait for review.

## Conventions to follow
- Existing components are the reference: `src/components/Input`, `Badge`, `Checkbox`, `TextArea`
- Tokens only; exceptions only after the user agreed, documented in `NO_TOKEN`
- Font: Inter Variable is loaded in `.storybook/preview.tsx` and matches the typography tokens
- Commits and PRs without a "Generated with Claude Code" line (the user asked to remove it)

## Don't
- Don't hardcode colors or invent values that are not in Figma or the tokens
- Don't edit `tokens.json` or `src/styles/*` by hand; missing tokens are fixed in Figma + `npm run tokens:sync`
- Don't commit, push or open a PR before the user says OK
- Don't merge the PR or accept Chromatic changes; that is the user's review
- Don't add dependencies without asking

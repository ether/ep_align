# Agent Guide — ep_align

Plugin that adds left/center/right/justify alignment buttons to the Etherpad editor toolbar, plus HTML export support for the four alignments.

## Tech stack

* Etherpad plugin framework (hooks declared in `ep.json`)
* EJS templates rendered server-side via `eejsBlock_*` hooks
* html10n for i18n (`locales/<lang>.json`, `data-l10n-id` in templates)
* `ep_plugin_helpers` for shared boilerplate

## Project structure

```
ep_align/
├── ep.json                                  # hook declarations
├── index.js                                 # server hooks
├── static/
│   ├── js/
│   │   ├── index.js                         # client hooks
│   │   └── shared.js                        # collectContent (shared client+server)
│   └── tests/
│       ├── backend/specs/exportHTML.ts      # Mocha export test
│       └── frontend-new/specs/align.spec.ts # Playwright UI test
├── templates/editbarButtons.ejs             # toolbar HTML
├── locales/<lang>.json                      # i18n strings (en.json is canonical)
├── package.json
├── CONTRIBUTING.md
└── AGENTS.md                                # this file
```

## Helpers used

* **`template` from `ep_plugin_helpers`** — renders `eejsBlock_editbarMenuLeft`. Passes the hook `args` to its `skip` callback so the read-only and toolbar-conflict checks both run there.

## Helpers NOT used (and why)

These are documented gaps, not omissions:

* **`lineAttribute`** — would replace `aceAttribsToClasses`, `aceDomLineProcessLineAttributes`, `aceRegisterBlockElements`, `aceRegisterLineAttributes`, and the `collectContentPre`/`Post` pair. The helper produces an unstyled `<{tag}>` wrapper; `ep_align` currently emits `<{tag} style="...;text-align:{tag}">`. Adopting the helper requires moving styling into a CSS file injected via `aceEditorCSS` and updating the Playwright assertion. Tracked as a follow-up.
* **`lineAttributeExport`** — produces `<{tag}>...</{tag}>`. The backend export spec enforces `<p style='text-align:{tag}'>...</p>` for back-compat with consumers of the HTML export API. Adopting requires either extending the helper with a `wrapInP`-style option or breaking export compatibility.

## Running tests locally

`ep_align` runs inside Etherpad's test harness. From an etherpad checkout that has installed this plugin via `pnpm run plugins i --path ../ep_align`:

```bash
# Backend (Mocha) — harness boots its own server
pnpm --filter ep_etherpad-lite run test

# Playwright — needs `pnpm run dev` in a second terminal
pnpm --filter ep_etherpad-lite run test-ui
```

## Standing rules for agent edits

* PRs target `main`. Linear commits, no merge commits.
* Every bug fix includes a regression test in the same commit.
* All user-facing strings in `locales/`. No hardcoded English in templates.
* No hardcoded `aria-label` on icon-only controls — etherpad's html10n auto-populates `aria-label` from the localized string when (a) the element has a `data-l10n-id` and (b) no author-supplied `aria-label` is present. Adding a hardcoded English `aria-label` blocks that and leaves it untranslated. (See `etherpad-lite/src/static/js/vendors/html10n.ts:665-678`.)
* No nested interactive elements (no `<button>` inside `<a>`).
* Never break the export shape (`<p style='text-align:X'>...</p>`) without updating `static/tests/backend/specs/exportHTML.ts` to match the new contract.
* LLM/Agent contributions are explicitly welcomed by maintainers.

## Quick reference: hooks declared in `ep.json`

* Server: `eejsBlock_editbarMenuLeft`, `padInitToolbar`, `getLineHTMLForExport`, `collectContentPre`, `collectContentPost`
* Client: `aceEditEvent`, `postToolbarInit`, `aceDomLineProcessLineAttributes`, `postAceInit`, `aceInitialized`, `aceAttribsToClasses`, `aceRegisterBlockElements`, `aceRegisterLineAttributes`, `collectContentPre` (shared.js)

When adding a hook, register it in both `ep.json` *and* the matching `exports.<hook> = ...` in the JS file.

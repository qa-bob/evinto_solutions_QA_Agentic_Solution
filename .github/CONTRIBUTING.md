# Contributing

Thank you for contributing to the Evinto Solutions QA suite. This guide explains the standards every contributor must follow.

---

## Prerequisites

- Node.js 18+, npm 9+
- Claude Code CLI (for slash commands and agentic workflows)
- A basic understanding of Playwright and TypeScript

---

## Development workflow

```bash
# Install dependencies
npm install
npx playwright install

# Before making changes — run the full suite to establish a baseline
npm test

# After changes — verify everything still passes
npm test
npm run typecheck
npm run lint
```

---

## Rules every contributor must follow

### Tests

- **Never submit forms.** Tests must only interact with fields (fill, focus, check validation) without clicking submit. This prevents spam to real company inboxes.
- **Never create accounts or log in** unless `auth.required: true` in `site.config.json`.
- **No hardcoded URLs.** Use `baseURL` from the Playwright config, which reads `site.config.json`.
- **Tag every test** with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`.
- **No `page.waitForTimeout()`** except brief post-animation pauses (≤500ms). Use Playwright's built-in auto-waiting.
- **No `page.locator()` in test bodies.** All selectors live in page object classes.

### Page Object Model

- Every page or major section gets its own class in `src/pages/`.
- Classes extend `BasePage`.
- Locators are `readonly Locator` properties typed explicitly on the class.
- Methods represent user actions — no `expect()` inside page objects.

### TypeScript

- Strict mode is enabled. All `any` usage requires an explicit `// reason: <why>` comment.
- Run `npm run typecheck` before pushing. PRs with TypeScript errors will not be merged.

### Visual baselines

- Run `npm run baseline` to capture baselines before merging visual test changes.
- Review every updated image in `__snapshots__/` visually before committing — automated tools will not catch intentional regressions.
- Commit baselines in the same PR as the tests that require them.

---

## Pull request checklist

Before opening a PR, confirm:

- [ ] `npm test` passes locally
- [ ] `npm run typecheck` passes (zero errors)
- [ ] `npm run lint` passes (zero warnings)
- [ ] All new tests are tagged appropriately
- [ ] No hardcoded URLs, no form submissions, no accounts created
- [ ] If visual tests changed, baselines are updated and reviewed
- [ ] PR description explains *what* changed and *why*

---

## Branching and commits

- Branch from `main`. Name branches: `feat/<feature>`, `fix/<issue>`, `chore/<task>`.
- Keep commits focused — one logical change per commit.
- Write commit messages in the imperative: "add pricing section tests", not "added pricing tests".

---

## Adding Claude Code skills or agents

- Skills go in `.claude/commands/<name>.md`. See [Skills.md](../Skills.md) for the format.
- Agents go in `.claude/agents/<name>.md`. See [AGENTS.md](../AGENTS.md) for the format.
- Always document new additions in the respective root-level doc file.

---

## Questions?

Open an issue using the appropriate template in `.github/ISSUE_TEMPLATE/`.

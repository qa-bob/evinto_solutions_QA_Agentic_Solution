---
paths:
  - "tests/**/*.spec.ts"
---

# Playwright Test Rules

When writing or editing files in `tests/**/*.spec.ts`:

- Always import `{ test, expect }` from `@fixtures/site.fixture`, never from `@playwright/test`
- Tag every `test()` call with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Organize tests in `test.describe()` blocks; the describe label should also carry the tag, e.g. `'Hero Section @functional'`
- Use fixture-injected page objects (`homePage`, `navigationPage`, `contactPage`) — no raw `page.locator()` in the test body
- Never call `page.waitForTimeout()` with values above 500ms; use Playwright auto-waiting or `waitForSelector`
- Never submit forms: interactions are limited to `fill()`, `focus()`, `blur()`, `hover()`, and checking validation state
- Never navigate to a URL string literal — use `siteConfig.url` or a path appended to it
- For anchor-based navigation on this SPA, use `page.goto(siteConfig.url + '#section')` or click the nav link
- Wrap error-prone navigations in try/catch and use `test.skip()` rather than hard-failing when a path does not exist
- Assert with descriptive messages: `expect(value, 'what this value represents').toBe(...)`

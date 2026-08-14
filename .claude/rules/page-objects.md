---
paths:
  - "src/pages/**/*.ts"
---

# Page Object Rules

When writing or editing files in `src/pages/**/*.ts`:

- Every class must extend `BasePage` from `./base.page`
- Constructor signature: `constructor(page: Page, config: SiteConfig)` — call `super(page, config)`
- All locators are `readonly Locator` declared as class properties and initialized in the constructor
- Methods represent user actions (scroll, click, fill, open) — never contain `expect()` assertions
- Method return types must be explicit; use `Promise<void>`, `Promise<string>`, `Promise<boolean>`, etc.
- No `any` types without a `// reason:` comment explaining the exception
- For this SPA, section locators should use `page.locator('#section-id')` or data attributes when available
- Prefer `locator.scrollIntoViewIfNeeded()` over `page.evaluate(() => el.scrollIntoView())` for visibility
- Export the class as a named export, not a default export
- Filename convention: `<section>.page.ts` in kebab-case

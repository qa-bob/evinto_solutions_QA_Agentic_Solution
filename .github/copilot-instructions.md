# GitHub Copilot Instructions

This repository is a **Playwright + TypeScript regression test suite** for [Optima](http://simplyoptima.com) — Case Management and Volunteer Software for CASA Programs — built by Evinto Solutions.

## Architecture

- **Pattern:** Page Object Model (POM) with Object-Oriented Programming (OOP)
- **Test runner:** Playwright with TypeScript (strict mode)
- **Page objects:** `src/pages/` — one class per page/section, all extending `BasePage`
- **Fixtures:** `src/fixtures/site.fixture.ts` — always import `{ test, expect }` from here, not from `@playwright/test`
- **Config:** `site.config.json` — single source of truth for site URL and flags

## Key rules

- Never submit forms, create accounts, or hardcode URLs in tests
- Assertions (`expect()`) belong in test files only — never inside page object methods
- All locators are `readonly Locator` properties declared on the page object class
- Tag every test: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, or `@responsive`
- No `page.waitForTimeout()` — use Playwright's built-in waiting

## Site structure (single-page app)

The site under test is a single-page application. Navigation uses anchor links:
- `#hero` — Hero/homepage section
- `#features` — Features grid (Reporting, Time Savings, Support, etc.)
- `#plans` — Pricing tiers (6 tiers, $95–$420/month)
- `#steps` — 3-step implementation process
- `#testimonials` — Customer testimonials
- `#about` — Team bios
- `#footer` — Contact info and social links

## TypeScript paths

```json
"@pages/*"    → src/pages/*
"@utils/*"    → src/utils/*
"@types/*"    → src/types/*
"@fixtures/*" → src/fixtures/*
```

## Test file structure

```typescript
import { test, expect } from '@fixtures/site.fixture';

test.describe('Section Name @tag', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('specific behavior @tag', async ({ homePage }) => {
    // assertion here using page object methods
    expect(await homePage.getMainHeading()).toBeTruthy();
  });
});
```

## When generating page objects

```typescript
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@types/site-config.types';

export class MySectionPage extends BasePage {
  readonly sectionContainer: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.sectionContainer = page.locator('#section-id');
  }

  async scrollIntoView(): Promise<void> {
    await this.sectionContainer.scrollIntoViewIfNeeded();
  }
}
```

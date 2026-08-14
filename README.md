# Evinto Solutions — Playwright QA Suite

Automated regression, functional, and visual test suite for [Optima](http://simplyoptima.com) — Case Management and Volunteer Software for CASA Programs — built with Playwright + TypeScript following the Page Object Model (POM) design pattern.

---

## Table of Contents

- [Project Purpose](#project-purpose)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Claude Code Setup](#claude-code-setup)
- [Architecture](#architecture)
- [Writing Tests](#writing-tests)
- [Contributing](#contributing)
- [Configuration Reference](#configuration-reference)

---

## Project Purpose

This repository provides a comprehensive GUI, functional, and regression test suite for the Optima web application at `http://simplyoptima.com`. It is designed to:

- Validate all major features and sections without creating accounts or submitting forms
- Catch regressions after site updates through visual comparison and behavioral checks
- Run on all three viewports (desktop 1280px, tablet 768px, mobile 390px)
- Execute automatically in CI via GitHub Actions on every pull request

**Site under test:** Optima — single-page application with anchor-based navigation covering a Hero, Features grid, Pricing tiers, Implementation steps, Testimonials, Team/About, and a Footer contact section.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18 or later |
| npm | 9 or later |
| Git | Any recent version |
| Claude Code CLI | Latest (for agentic commands) |

---

## Getting Started

```bash
# 1. Clone the repository
git clone <repo-url>
cd evinto_solutions_QA_Agentic_Solution

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Copy environment template (optional — tests use site.config.json by default)
cp .env.example .env

# 5. Verify the site URL in site.config.json
cat site.config.json
```

---

## Running Tests

```bash
# Run the full test suite across all browsers and viewports
npm test

# Targeted suites
npm run test:smoke          # Site availability and basic load checks
npm run test:navigation     # Nav links, routing, mobile menu
npm run test:forms          # Contact form fields and validation
npm run test:functional     # Business features: hero, pricing, testimonials
npm run test:visual         # Screenshot regression (requires baselines)
npm run test:responsive     # Layout at mobile/tablet/desktop viewports

# View the HTML report after a run
npm run report

# Update visual baselines after intentional design changes
npm run baseline

# TypeScript type check (run before pushing)
npm run typecheck

# Lint source and test files
npm run lint

# Run with Playwright UI (interactive debugging)
npm run test:headed
```

### First-time visual baselines

Visual tests skip on first run because no baseline images exist yet. Capture them with:

```bash
npm run baseline
```

Review the generated images in `__snapshots__/` before committing. Commit them to version control so CI can compare against them.

---

## Claude Code Setup

This repo is configured for agentic execution by [Claude Code](https://code.claude.com). All configuration lives in `.claude/`.

### Install Claude Code

```powershell
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

Then open this project:

```bash
claude
```

### Available slash commands (skills)

| Command | What it does |
|---------|-------------|
| `/analyze-site` | Crawls the live site, outputs a refreshed `site.config.json` and an issue checklist |
| `/run-smoke` | Runs smoke tests and displays a formatted pass/fail table |
| `/update-baseline` | Captures new visual snapshots after deliberate design changes |
| `/generate-report` | Parses `test-results/results.json` and displays a structured test summary |
| `/generate-full-suite` | Inspects the live site and regenerates all POM classes and test files |

Invoke any command by typing it in the Claude Code chat, e.g. `/run-smoke`.

### Available subagents

| Agent | When Claude uses it |
|-------|---------------------|
| `site-analyzer` | When asked to inspect the live site or refresh `site.config.json` |
| `test-generator` | When asked to generate site-specific tests beyond the shared suite |

See [AGENTS.md](./AGENTS.md) for full agent documentation and [Skills.md](./Skills.md) for skill details.

---

## Architecture

This project follows the **Page Object Model (POM)** and **Object-Oriented Programming (OOP)** design patterns.

```
site.config.json            ← Site URL, flags, expected nav items
playwright.config.ts        ← Playwright projects (desktop, mobile, tablet)
global-setup.ts             ← Reachability pre-check before any test runs

src/
  pages/
    base.page.ts            ← BasePage: shared navigation, screenshot, console-error helpers
    home.page.ts            ← Hero text, CTAs, main heading, isLoaded()
    navigation.page.ts      ← Nav visibility, link extraction, mobile menu, reachability check
    contact.page.ts         ← Form discovery, field inspection, fill (no submit)
    features.page.ts        ← Features section locators and assertions
    pricing.page.ts         ← Pricing tier cards, plan counts, Schedule Demo buttons
  fixtures/
    site.fixture.ts         ← Custom test fixture: siteConfig, homePage, navigationPage, contactPage
  utils/
    link-checker.ts         ← HTTP HEAD request helpers for link validation
    visual-helper.ts        ← Cookie banner dismissal before visual captures
  types/
    site-config.types.ts    ← TypeScript interfaces for site.config.json

tests/
  smoke/                    ← @smoke: load, HTTPS, title, console errors, timing
  navigation/               ← @navigation: nav visibility, link reachability, mobile menu
  forms/                    ← @forms: form presence, required fields, submit button, validation
  functional/               ← @functional: hero, features, pricing, anchor nav, testimonials
  visual/                   ← @visual: screenshot regression at desktop/tablet/mobile
  responsive/               ← @responsive: no horizontal scroll, font sizes, alt text, viewport meta

.claude/
  commands/                 ← Slash command definitions (skills) invokable via /command-name
  agents/                   ← Subagent definitions Claude uses for specialized tasks
  rules/                    ← Path-scoped coding rules loaded when working on matching files
  settings.json             ← Claude Code permissions and behavior settings

.github/
  workflows/
    playwright.yml          ← GitHub Actions CI: install → typecheck → test on every PR
  CONTRIBUTING.md           ← Contribution guidelines
  ISSUE_TEMPLATE/           ← Bug report and feature request templates
  PULL_REQUEST_TEMPLATE.md  ← PR checklist
  copilot-instructions.md   ← GitHub Copilot context for this repo
```

### Page Object Model rules

- Every page or major section has its own class in `src/pages/`
- All classes extend `BasePage`
- Locators are `readonly Locator` properties declared on the class
- Methods represent user **actions**, not assertions (no `expect()` in page objects)
- Assertions belong exclusively in `tests/`

### Test rules

- Import `{ test, expect }` from `@fixtures/site.fixture` — never from `@playwright/test` directly
- Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- Never hardcode the base URL — use `baseURL` from Playwright config (which reads `site.config.json`)
- Never submit forms, create accounts, or enter real credentials
- Use Playwright auto-waiting — no `page.waitForTimeout()` beyond brief animation delays

---

## Writing Tests

### Adding a new test

1. Identify which section the feature belongs to (smoke, navigation, forms, functional, visual, responsive)
2. Check whether a page object already covers that section — if not, add a new class in `src/pages/`
3. Add any new locators to the page object class
4. Write the test in the appropriate `tests/` directory, using the custom fixture
5. Run `npm run typecheck` to ensure TypeScript compiles cleanly
6. Run the new test locally: `npx playwright test tests/<path>/<file>.spec.ts`

### Adding a new page object

```typescript
// src/pages/my-section.page.ts
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class MySectionPage extends BasePage {
  readonly myElement: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.myElement = page.locator('[data-section="my-section"]');
  }

  async scrollIntoView(): Promise<void> {
    await this.myElement.scrollIntoViewIfNeeded();
  }
}
```

Then register the fixture in `src/fixtures/site.fixture.ts`.

---

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full contribution guide. Quick summary:

- One logical change per PR
- All tests must pass: `npm test`
- TypeScript must compile: `npm run typecheck`
- Lint must pass: `npm run lint`
- Visual baselines must be reviewed before committing
- No form submissions, account creation, or hardcoded URLs in tests
- Follow POM conventions — no raw `page.locator()` calls in test bodies

---

## Configuration Reference

### `site.config.json`

| Field | Type | Purpose |
|-------|------|---------|
| `name` | string | Company/product name (used in test output) |
| `url` | string | Base URL under test |
| `description` | string | Site description |
| `industry` | string | Industry category |
| `hasContactForm` | boolean | Whether contact form tests should run |
| `expectedNavItems` | string[] | Expected navigation link texts |
| `viewports` | string[] | Viewports to test: desktop, mobile, tablet |
| `skipVisual` | boolean | Skip visual regression (use for heavy-animation sites) |
| `skipForms` | boolean | Skip forms test suite |
| `auth.required` | boolean | Set true if site requires login |
| `auth.loginUrl` | string | Login page URL if auth.required is true |

### Environment variables

| Variable | Purpose |
|----------|---------|
| `SITE_URL` | Override the URL from `site.config.json` (useful in CI staging environments) |
| `CI` | Set by CI systems; enables `forbidOnly`, retry once, and limit workers to 2 |

---

*This repository is part of the Phoenix Startup QA Agentic Solutions project.*

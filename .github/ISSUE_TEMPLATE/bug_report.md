---
name: Bug report
about: A test is failing, flaky, or producing incorrect results
title: '[BUG] '
labels: bug
assignees: ''
---

## Test that is failing

<!-- Test file and test name, e.g. tests/smoke/site-availability.spec.ts > "site homepage loads successfully" -->

**File:** `tests/`
**Test name:**
**Tag:** `@`

## Expected behavior

<!-- What should happen? -->

## Actual behavior

<!-- What actually happens? Include the full error message. -->

```
paste error here
```

## Environment

- **OS:**
- **Node.js version:** (`node --version`)
- **Playwright version:** (`npx playwright --version`)
- **Branch:**

## Steps to reproduce

```bash
npx playwright test tests/<path>/<file>.spec.ts --grep "test name" --headed
```

## Screenshots / traces

<!-- Attach playwright-report/, test-results/trace.zip, or screenshots if available -->

## Notes

<!-- Is this consistently failing or flaky? Does it pass on a specific browser? -->

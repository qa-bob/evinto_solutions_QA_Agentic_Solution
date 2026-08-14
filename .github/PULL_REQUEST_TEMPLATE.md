## Summary

<!-- What changed and why? 1-3 bullet points. -->

-
-

## Type of change

- [ ] New tests added
- [ ] Existing tests updated / fixed
- [ ] Page object added or updated
- [ ] Infrastructure / config change
- [ ] Documentation update

## Test checklist

- [ ] `npm test` passes locally
- [ ] `npm run typecheck` passes (zero TypeScript errors)
- [ ] `npm run lint` passes
- [ ] All new tests are tagged (`@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, or `@responsive`)
- [ ] No hardcoded URLs in tests (using `baseURL` / `siteConfig.url`)
- [ ] No form submissions, no account creation
- [ ] No raw `page.locator()` calls in test bodies (all selectors in page objects)

## Visual regression

- [ ] No visual tests changed — skip this section
- [ ] Visual baselines updated (`npm run baseline`)
- [ ] Updated screenshot files reviewed visually before committing

## Notes for reviewers

<!-- Anything the reviewer should pay attention to? -->

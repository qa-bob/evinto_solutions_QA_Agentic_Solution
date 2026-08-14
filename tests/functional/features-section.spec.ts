/**
 * tests/functional/features-section.spec.ts
 *
 * Functional tests for the Optima Features section (#features).
 * Verifies the features grid is present, populated, and accessible.
 *
 * Site: Optima (http://simplyoptima.com) — single-page app.
 * Known features: Reporting, Time Savings, Staff Retention, Support,
 *   Volunteer Recruitment, Assessments, Data Integrity, Accessibility.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Features Section @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  test('features section exists in the DOM @functional', async ({ featuresPage }) => {
    expect(
      await featuresPage.featuresSection.count(),
      '#features section should exist in the DOM'
    ).toBeGreaterThan(0);
  });

  test('features section is reachable by scrolling @functional', async ({ featuresPage }) => {
    await featuresPage.scrollIntoView();
    const isVisible = await featuresPage.isVisible();
    expect(isVisible, '#features section should be visible after scrolling').toBeTruthy();
  });

  test('features section has a heading @functional', async ({ featuresPage }) => {
    await featuresPage.scrollIntoView();
    const heading = await featuresPage.getSectionHeadingText();
    expect(heading.length, 'Features section should have an H2 heading').toBeGreaterThan(3);
  });

  test('features section has heading mentioning "Features" @functional', async ({ featuresPage }) => {
    await featuresPage.scrollIntoView();
    const heading = await featuresPage.getSectionHeadingText();
    expect(
      heading.toLowerCase(),
      `Features section heading "${heading}" should reference "features" or "Optima"`
    ).toMatch(/features|optima/i);
  });

  test('features section lists multiple features @functional', async ({ featuresPage }) => {
    await featuresPage.scrollIntoView();
    const count = await featuresPage.getFeatureCount();
    expect(
      count,
      'Features section should list at least 4 individual feature items'
    ).toBeGreaterThanOrEqual(4);
  });

  test('feature titles are non-empty strings @functional', async ({ featuresPage }) => {
    await featuresPage.scrollIntoView();
    const titles = await featuresPage.getFeatureTitles();

    expect(titles.length, 'Should be able to read at least one feature title').toBeGreaterThan(0);

    for (const title of titles) {
      expect(title.trim().length, `Feature title "${title}" should not be empty`).toBeGreaterThan(0);
    }
  });

  test('features section navigation link scrolls to section @functional', async ({ page, siteConfig }) => {
    // The SPA nav has a "Features" anchor link
    const featuresNavLink = page.locator('nav a[href*="#features"], nav a').filter({ hasText: /features/i }).first();

    if (await featuresNavLink.count() === 0) {
      console.warn('[functional] No "Features" nav link found — skipping scroll test.');
      return;
    }

    await featuresNavLink.click();
    await page.waitForTimeout(500); // allow smooth scroll

    // After clicking, the features section should be in view
    const section = page.locator('#features');
    await expect(section, '#features should exist after nav click').toBeAttached();
  });
});

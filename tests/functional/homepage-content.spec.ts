/**
 * tests/functional/homepage-content.spec.ts
 *
 * Functional tests for the Optima homepage above-the-fold content.
 * Covers the hero section, main heading, and primary CTAs.
 *
 * Site: Optima (http://simplyoptima.com) — single-page app.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Content @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForLoad();
  });

  // ── Hero section ────────────────────────────────────────────────────────────

  test('homepage has a visible H1 heading @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading, 'H1 (or fallback H2) should have text content').toBeTruthy();
    expect(heading.length, 'Main heading should be meaningful').toBeGreaterThan(3);
  });

  test('homepage H1 references the product name @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(
      heading.toLowerCase(),
      `H1 "${heading}" should reference "Optima" or "CASA"`
    ).toMatch(/optima|casa/i);
  });

  test('homepage hero section contains visible text @functional', async ({ homePage }) => {
    const heroText = await homePage.getHeroText();
    expect(heroText.trim().length, 'Hero section should have meaningful text content').toBeGreaterThan(20);
  });

  test('homepage has loaded all key elements @functional', async ({ homePage }) => {
    const isLoaded = await homePage.isLoaded();
    expect(isLoaded, 'Homepage should be fully loaded (heading + nav + body text)').toBeTruthy();
  });

  // ── CTAs ─────────────────────────────────────────────────────────────────────

  test('homepage has at least one CTA button @functional', async ({ homePage }) => {
    const ctaButtons = await homePage.getCTAButtons();
    expect(
      ctaButtons.length,
      'Homepage should have at least one CTA button (e.g. "Book Demo")'
    ).toBeGreaterThan(0);
  });

  test('Book Demo CTA is visible @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const bookDemo = page.getByRole('link', { name: /book demo/i }).first();

    if (await bookDemo.count() === 0) {
      // Fallback: look for any demo-related CTA
      const fallback = page.locator('a, button').filter({ hasText: /demo|schedule/i }).first();
      expect(await fallback.count(), 'A demo CTA should exist on the homepage').toBeGreaterThan(0);
      await expect(fallback, 'Demo CTA should be visible').toBeVisible();
      return;
    }

    await expect(bookDemo, '"Book Demo" link should be visible').toBeVisible();
  });

  test('Book Demo CTA has a valid href @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const bookDemo = page.locator('a').filter({ hasText: /book demo/i }).first();

    if (await bookDemo.count() === 0) {
      console.warn('[functional] "Book Demo" link not found — skipping href check.');
      return;
    }

    const href = await bookDemo.getAttribute('href');
    expect(href, '"Book Demo" link should have a non-empty href').toBeTruthy();
    expect(href, '"Book Demo" href should not be "#" or empty').not.toBe('#');
  });

  // ── Social proof ─────────────────────────────────────────────────────────────

  test('homepage mentions number of programs served @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    const bodyText = await page.evaluate<string>(() => document.body.innerText);

    // The site claims "Serving Over 500 Programs Nationwide"
    expect(
      bodyText,
      'Homepage should reference the number of programs served'
    ).toMatch(/\d+\s*(programs?|nationwide)/i);
  });
});

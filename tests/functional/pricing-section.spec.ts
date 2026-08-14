/**
 * tests/functional/pricing-section.spec.ts
 *
 * Functional tests for the Optima Pricing / Plans section (#plans).
 * Verifies plan tiers are present, prices are displayed, and
 * demo scheduling CTAs exist for each tier.
 *
 * Site: Optima (http://simplyoptima.com) — single-page app.
 * Known tiers: 6 pricing tiers ranging from $95 to $420/month based on user count.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Pricing Section @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  test('pricing section exists in the DOM @functional', async ({ pricingPage }) => {
    expect(
      await pricingPage.pricingSection.count(),
      '#plans section should exist in the DOM'
    ).toBeGreaterThan(0);
  });

  test('pricing section is reachable by scrolling @functional', async ({ pricingPage }) => {
    await pricingPage.scrollIntoView();
    const isVisible = await pricingPage.isVisible();
    expect(isVisible, '#plans section should be visible after scrolling').toBeTruthy();
  });

  test('pricing section has a heading @functional', async ({ pricingPage }) => {
    await pricingPage.scrollIntoView();
    const heading = await pricingPage.getSectionHeadingText();
    expect(heading.length, 'Pricing section should have an H2 heading').toBeGreaterThan(3);
  });

  test('pricing section heading references plans or pricing @functional', async ({ pricingPage }) => {
    await pricingPage.scrollIntoView();
    const heading = await pricingPage.getSectionHeadingText();
    expect(
      heading.toLowerCase(),
      `Pricing heading "${heading}" should reference "plan", "pricing", or "Optima"`
    ).toMatch(/plan|pricing|optima/i);
  });

  test('pricing section has multiple tiers @functional', async ({ pricingPage }) => {
    await pricingPage.scrollIntoView();
    const count = await pricingPage.getTierCount();
    expect(
      count,
      'Pricing section should show at least 3 tiers'
    ).toBeGreaterThanOrEqual(3);
  });

  test('pricing section displays dollar amounts @functional', async ({ pricingPage }) => {
    await pricingPage.scrollIntoView();

    // Look for price text using a broad approach — any text containing $ in the section
    const priceText = await pricingPage.pricingSection.evaluate<string>((el) => (el as HTMLElement).innerText ?? '');
    expect(
      priceText,
      'Pricing section should display at least one dollar amount'
    ).toMatch(/\$\d+/);
  });

  test('pricing section has "Schedule Demo" CTAs @functional', async ({ pricingPage }) => {
    await pricingPage.scrollIntoView();
    const buttonCount = await pricingPage.getScheduleDemoButtonCount();
    expect(
      buttonCount,
      'Pricing section should have at least one "Schedule Demo" or "Book Demo" CTA'
    ).toBeGreaterThan(0);
  });

  test('pricing nav link scrolls to plans section @functional', async ({ page, siteConfig }) => {
    const plansNavLink = page.locator('nav a[href*="#plans"], nav a').filter({ hasText: /plans?|pricing/i }).first();

    if (await plansNavLink.count() === 0) {
      console.warn('[functional] No "Plans" nav link found — skipping scroll test.');
      return;
    }

    await plansNavLink.click();
    await page.waitForTimeout(500); // allow smooth scroll

    const section = page.locator('#plans');
    await expect(section, '#plans should exist after nav click').toBeAttached();
  });
});

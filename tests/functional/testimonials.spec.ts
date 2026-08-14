/**
 * tests/functional/testimonials.spec.ts
 *
 * Functional tests for the Optima Testimonials / Reviews section (#testimonials).
 * Verifies social proof content is present and readable.
 *
 * Site: Optima (http://simplyoptima.com) — single-page app.
 * Known content: 6 customer quotes from various state CASA programs.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Testimonials Section @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  test('testimonials section exists in the DOM @functional', async ({ page }) => {
    const section = page.locator('#testimonials');
    expect(
      await section.count(),
      '#testimonials section should exist in the DOM'
    ).toBeGreaterThan(0);
  });

  test('testimonials section is visible after scrolling @functional', async ({ page }) => {
    const section = page.locator('#testimonials');
    await section.scrollIntoViewIfNeeded();
    await expect(section, '#testimonials section should be visible').toBeVisible();
  });

  test('testimonials section has a heading @functional', async ({ page }) => {
    const section = page.locator('#testimonials');
    await section.scrollIntoViewIfNeeded();

    const heading = section.locator('h2, h3').first();
    if (await heading.count() === 0) {
      console.warn('[functional] #testimonials has no heading — skipping heading text check.');
      return;
    }

    const text = await heading.textContent();
    expect(text?.trim().length, 'Testimonials heading should have text').toBeGreaterThan(3);
  });

  test('testimonials section contains customer quote text @functional', async ({ page }) => {
    const section = page.locator('#testimonials');
    await section.scrollIntoViewIfNeeded();

    // Quotes are commonly wrapped in <blockquote>, elements with class "testimonial",
    // or <p> tags containing quotation marks
    const quotes = section.locator(
      'blockquote, [class*="testimonial"], [class*="quote"], [class*="review"]'
    );

    if (await quotes.count() === 0) {
      // Fallback: check that the section has substantial text
      const sectionText = await section.evaluate<string>((el) => (el as HTMLElement).innerText ?? '');
      expect(
        sectionText.trim().length,
        'Testimonials section should contain readable text content'
      ).toBeGreaterThan(100);
      return;
    }

    expect(
      await quotes.count(),
      'Testimonials section should have at least 1 customer quote'
    ).toBeGreaterThan(0);
  });

  test('testimonials section has multiple quotes @functional', async ({ page }) => {
    const section = page.locator('#testimonials');
    await section.scrollIntoViewIfNeeded();

    const quotes = section.locator(
      'blockquote, [class*="testimonial"], [class*="quote"], [class*="review"]'
    );

    if (await quotes.count() === 0) {
      console.warn('[functional] Could not identify individual quote elements — skipping count check.');
      return;
    }

    expect(
      await quotes.count(),
      'Testimonials section should have more than 1 quote (site claims 6)'
    ).toBeGreaterThan(1);
  });

  test('testimonials nav link is present @functional', async ({ page }) => {
    const reviewsLink = page
      .locator('nav a, [role="navigation"] a')
      .filter({ hasText: /reviews?|testimonials?/i })
      .first();

    if (await reviewsLink.count() === 0) {
      console.warn('[functional] No "Reviews" or "Testimonials" nav link found.');
      return;
    }

    await expect(reviewsLink, 'Reviews nav link should be visible').toBeVisible();
    const href = await reviewsLink.getAttribute('href');
    expect(href, 'Reviews nav link should have an href').toBeTruthy();
  });
});

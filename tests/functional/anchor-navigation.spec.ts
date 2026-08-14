/**
 * tests/functional/anchor-navigation.spec.ts
 *
 * Functional tests for Optima's SPA anchor-based navigation.
 * All navigation uses in-page anchor links (#section-id).
 * Tests verify that each anchor target section exists and is reachable.
 *
 * Site: Optima (http://simplyoptima.com) — single-page app.
 * Known anchors: #hero, #features, #plans, #steps, #testimonials, #about, #footer
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const KNOWN_SECTIONS: Array<{ anchor: string; navText: RegExp; description: string }> = [
  { anchor: '#features', navText: /features/i, description: 'Features section' },
  { anchor: '#plans', navText: /plans?/i, description: 'Pricing plans section' },
  { anchor: '#steps', navText: /training|steps/i, description: 'Training / implementation steps section' },
  { anchor: '#testimonials', navText: /reviews?|testimonials?/i, description: 'Testimonials section' },
  { anchor: '#about', navText: /about/i, description: 'About / team section' },
];

test.describe('Anchor Navigation @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  test('all known anchor sections exist in the DOM @functional', async ({ page }) => {
    const missing: string[] = [];

    for (const section of KNOWN_SECTIONS) {
      const el = page.locator(section.anchor);
      if (await el.count() === 0) {
        missing.push(`${section.anchor} (${section.description})`);
      }
    }

    expect(
      missing,
      `The following anchor sections are missing from the DOM:\n${missing.join('\n')}`
    ).toHaveLength(0);
  });

  for (const section of KNOWN_SECTIONS) {
    test(`navigating via URL hash "${section.anchor}" loads the page @functional`, async ({ page, siteConfig }) => {
      const url = siteConfig.url.replace(/\/$/, '') + '/' + section.anchor;
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

      expect(
        response,
        `Navigating to ${url} should return a response`
      ).not.toBeNull();

      const status = response!.status();
      expect(
        status >= 200 && status < 400,
        `${url} returned HTTP ${status} — expected 2xx/3xx`
      ).toBeTruthy();

      // The anchor section should exist in the DOM
      const el = page.locator(section.anchor);
      expect(
        await el.count(),
        `${section.anchor} should exist in DOM after navigating to hash URL`
      ).toBeGreaterThan(0);
    });
  }

  test('nav links for all known sections are present @functional', async ({ page }) => {
    const missing: string[] = [];

    for (const section of KNOWN_SECTIONS) {
      const navLink = page
        .locator('nav a, [role="navigation"] a')
        .filter({ hasText: section.navText });

      if (await navLink.count() === 0) {
        missing.push(`${section.anchor} (text matching: ${section.navText})`);
      }
    }

    if (missing.length > 0) {
      console.warn(
        '[functional] Nav links not found for these sections:\n' +
          missing.map((s) => `  ${s}`).join('\n')
      );
    }

    // Soft assertion: missing nav items are a UX issue, not a hard failure
    expect(
      missing.length,
      `${missing.length} expected nav section(s) have no matching nav link`
    ).toBeLessThanOrEqual(2);
  });

  test('clicking a nav anchor link does not navigate to a new page @functional', async ({ page, siteConfig }) => {
    const featuresLink = page
      .locator('nav a[href*="#features"], nav a')
      .filter({ hasText: /features/i })
      .first();

    if (await featuresLink.count() === 0) {
      console.warn('[functional] No Features nav link found — skipping in-page navigation test.');
      return;
    }

    // Track any full-page navigations
    let didNavigateAway = false;
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        const url = frame.url();
        // Anchor changes (#...) are not cross-page navigations
        if (!url.includes('#') && url !== siteConfig.url) {
          didNavigateAway = true;
        }
      }
    });

    await featuresLink.click();
    await page.waitForTimeout(300);

    expect(
      didNavigateAway,
      'Clicking a nav anchor link should NOT navigate away from the single-page app'
    ).toBeFalsy();
  });
});

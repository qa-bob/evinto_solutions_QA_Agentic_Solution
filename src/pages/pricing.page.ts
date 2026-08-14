import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class PricingPage extends BasePage {
  readonly pricingSection: Locator;
  readonly sectionHeading: Locator;
  readonly scheduleDemoButtons: Locator;
  readonly pricingTiers: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.pricingSection = page.locator('#plans');
    // Section uses H1 for its title; tier labels use H3
    this.sectionHeading = page.locator('#plans h1').first();
    this.scheduleDemoButtons = page.locator('#plans a, #plans button').filter({
      hasText: /schedule demo|book demo|get started|sign up/i,
    });
    this.pricingTiers = page.locator('#plans .pricing-box');
  }

  async scrollIntoView(): Promise<void> {
    await this.pricingSection.scrollIntoViewIfNeeded();
  }

  async isVisible(): Promise<boolean> {
    return this.pricingSection.isVisible();
  }

  async getSectionHeadingText(): Promise<string> {
    if (await this.sectionHeading.count() === 0) return '';
    return (await this.sectionHeading.textContent())?.trim() ?? '';
  }

  async getScheduleDemoButtonCount(): Promise<number> {
    return this.scheduleDemoButtons.count();
  }

  async getTierCount(): Promise<number> {
    return this.pricingTiers.count();
  }

  async getPriceStrings(): Promise<string[]> {
    // Look for elements containing a dollar sign — price displays
    const priceElements = this.pricingSection.locator(':text-matches("\\$\\d+")');
    const count = await priceElements.count();
    const prices: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await priceElements.nth(i).textContent();
      if (text?.trim()) prices.push(text.trim());
    }
    return prices;
  }
}

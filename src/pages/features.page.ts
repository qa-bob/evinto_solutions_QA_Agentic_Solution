import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class FeaturesPage extends BasePage {
  readonly featuresSection: Locator;
  readonly featureCards: Locator;
  readonly featureHeadings: Locator;
  readonly sectionHeading: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.featuresSection = page.locator('#features');
    this.featureCards = page.locator('#features .feature-box');
    // Section uses H1 for its title; individual feature names use H2
    this.featureHeadings = page.locator('#features h2');
    this.sectionHeading = page.locator('#features h1').first();
  }

  async scrollIntoView(): Promise<void> {
    await this.featuresSection.scrollIntoViewIfNeeded();
  }

  async isVisible(): Promise<boolean> {
    return this.featuresSection.isVisible();
  }

  async getSectionHeadingText(): Promise<string> {
    if (await this.sectionHeading.count() === 0) return '';
    return (await this.sectionHeading.textContent())?.trim() ?? '';
  }

  async getFeatureCount(): Promise<number> {
    return this.featureHeadings.count();
  }

  async getFeatureTitles(): Promise<string[]> {
    const count = await this.featureHeadings.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.featureHeadings.nth(i).textContent();
      if (text?.trim()) titles.push(text.trim());
    }
    return titles;
  }
}

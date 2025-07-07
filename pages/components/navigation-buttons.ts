import { Page, Locator, expect } from '@playwright/test';

export class NavigationButtons {
  readonly navButtons: Locator;
  readonly previousButton: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.navButtons = page.getByTestId('navigation-buttons');
    this.previousButton = page.getByTestId('previous-image-button');
    this.nextButton = page.getByTestId('next-image-button');
  }

  async nextImage() {
    await this.nextButton.click();
  }

  async previousImage() {
    await this.previousButton.click();
  }

  async nextIsDisabled() {
    await expect(this.nextButton).toBeDisabled();
  }

  async previousIsDisabled() {
    await expect(this.previousButton).toBeDisabled();
  }
}
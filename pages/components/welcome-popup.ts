import { Page, Locator, expect }from '@playwright/test';

export class WelcomePopup {
  readonly overlay: Locator;
  readonly acceptButton: Locator;

  constructor(page: Page) {
    this.overlay = page.getByTestId('welcome-popup-overlay');
    this.acceptButton = page.getByTestId('welcome-popup-accept-button');
  }

  async accept() {
    await this.acceptButton.click();
    await expect(this.overlay).toBeHidden();
  }
}
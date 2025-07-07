import { expect, Locator, Page } from '@playwright/test';
import { ImageRenderedDetails } from '../../models/image-details';

export class ImageViewer {
  readonly page: Page;
  readonly imageViewport: Locator;
  readonly image: Locator;
  readonly navInstructions: Locator;
  readonly imageIndexDisplay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.imageViewport = page.getByTestId('medical-image-viewport');
    this.image = page.getByTestId('medical-image');
    this.navInstructions = page.getByTestId('navigation-instructions');
    this.imageIndexDisplay = this.imageViewport.getByTestId('image-index-display');
  }

  async waitForImageRendered(): Promise<ImageRenderedDetails> {
    return this.imageViewport.evaluate(viewportElement => {
      return new Promise<ImageRenderedDetails>(resolve => {
        viewportElement.addEventListener(
          'imagerendered',
          (event) => {
            resolve((event as CustomEvent<ImageRenderedDetails>).detail);
          },
          { once: true }
        );
      });
    });
  }

  async compareImageScreenshot(seriesNumber: number, currentImageIndex: number) {
    await this.image.waitFor({ state: 'visible', timeout: 2000 });
    await expect(this.image).toHaveScreenshot(`${seriesNumber}_${currentImageIndex}.png`);
  }

  async expectImageIndex(expectedText: string) {
    await expect(this.imageIndexDisplay).toHaveText(expectedText);
  }

  async scrollMouseWheel(direction: 'down' | 'up') {
    await this.imageViewport.hover();
    await this.page.mouse.wheel(0, direction === 'down' ? 100 : -100);
  }

  async expectImageAttributesToMatch(renderedDetails: ImageRenderedDetails) {
    const imageAltText = await this.image.getAttribute('alt');
    const imageSource = await this.image.getAttribute('src');

    expect(imageAltText, `Image alt text should contain slice with index ${renderedDetails.imageIndex + 1}`).toContain(`slice ${renderedDetails.imageIndex + 1}`);
    expect(imageAltText, `Image alt text should contain Series number ${renderedDetails.series}`).toContain(`Series ${renderedDetails.series}`);
    expect(imageSource, `Image src should match ${renderedDetails.imageSource}`).toContain(renderedDetails.imageSource);
  }
}

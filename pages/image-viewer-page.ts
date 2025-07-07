import { Page, Locator, expect } from '@playwright/test';

export interface ImageRenderedDetail {
  imageIndex: number;
  series: number;
  imageSource: string;
  patientInfo: {
    name: string;
    id: string;
  };
  loadDelay: number;
}

export class ImageViewerPage {
  readonly welcomePopup: Locator;
  readonly welcomePopupAcceptButton: Locator;
  readonly seriesSelectionPanel: Locator;
  readonly currentSeriesInfo: Locator;
  readonly medicalImageViewer: Locator;
  readonly currentImage: Locator;
  readonly patientInformationOverlay: Locator;

  constructor(public readonly page: Page) {
    this.welcomePopup = page.getByTestId('welcome-popup-overlay');
    this.welcomePopupAcceptButton = page.getByTestId('welcome-popup-accept-button');
    this.seriesSelectionPanel = page.getByTestId('series-selection-panel');
    this.currentSeriesInfo = page.getByTestId('current-series-info');
    this.medicalImageViewer = page.getByTestId('medical-image-viewport');
    this.currentImage = page.getByTestId('medical-image');
    this.patientInformationOverlay = page.getByTestId('patient-information-overlay');
  }

  async goto() {
    await this.page.goto('/');
  }

  async closeWelcomePopup() {
    await this.welcomePopupAcceptButton.click();
  }

  async getSeriesButton(seriesNumber: number) {
    return this.seriesSelectionPanel.getByTestId(`series-${seriesNumber}-button`);
  }

  async selectImageSeries(seriesNumber: number) {
    const seriesButton = await this.getSeriesButton(seriesNumber);
    await seriesButton.click();
  }

  async isSeriesHighlighted(seriesNumber: number) {
    const seriesButton = await this.getSeriesButton(seriesNumber);
    await expect(seriesButton).toHaveClass(/\bbg-blue-600\b/);
  }

  async getNumberOfImages(seriesNumber: number): Promise<number> {
    const seriesButton = await this.getSeriesButton(seriesNumber);

    const seriesInfoText = await seriesButton.innerText();
    const matchNrImages = seriesInfoText.match(/(\d+)\s+images?/i);
    const imageCount = matchNrImages ? parseInt(matchNrImages[1], 10) : 0;

    console.log(`Series ${seriesNumber} has ${imageCount} images.`);
    return imageCount;
  }

  async compareImages(seriesNumber: number, currentImageIndex: number) {
    await this.patientInformationOverlay.evaluate(patientInfo => patientInfo.style.display = 'none');
    console.log('Taking screenshot of:', await this.currentImage.getAttribute('src'));
    await expect(this.currentImage).toHaveScreenshot(`${seriesNumber}_${currentImageIndex}.png`);
  }

  async scrollMouseWheel(direction: 'down' | 'up') {
    await this.medicalImageViewer.hover();
    await this.page.mouse.wheel(0, direction === 'down' ? 10 : -10);
  }

  async waitForImageToBeRendered(): Promise<ImageRenderedDetail | null> {
    return await this.page.evaluate(() => {
      return new Promise<ImageRenderedDetail | null>((resolve) => {
        const imageViewport = document.querySelector('[data-testid="medical-image-viewport"]');

        if (!imageViewport) return resolve(null);

        const eventHandler = (event: any) => {
          imageViewport.removeEventListener('imagerendered', eventHandler);
          resolve(event.detail);
        };

        imageViewport.addEventListener('imagerendered', eventHandler);
      });
    });
  }
}
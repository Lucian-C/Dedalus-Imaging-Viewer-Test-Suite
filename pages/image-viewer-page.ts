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
  readonly welcomePopupAacceptButton: Locator;
  readonly series1Button: Locator;
  readonly series2Button: Locator;
  readonly currentSeriesInfo: Locator;
  readonly medicalImageViewer: Locator;
  readonly currentImage: Locator;
  readonly patientInformationOverlay: Locator;

  constructor(public readonly page: Page) {
    this.welcomePopup = page.getByTestId('welcome-popup-overlay');
    this.welcomePopupAacceptButton = page.getByTestId('welcome-popup-accept-button');
    this.series1Button = page.getByTestId('series-1-button');
    this.series2Button = page.getByTestId('series-2-button');
    this.currentSeriesInfo = page.getByTestId('current-series-info');
    this.medicalImageViewer = page.getByTestId('medical-image-viewport');
    this.currentImage = page.getByTestId('medical-image');
    this.patientInformationOverlay = page.getByTestId('patient-information-overlay');
  }

  async goto() {
    await this.page.goto('/');
  }

  async closeWelcomePopup() {
    await this.welcomePopupAacceptButton.click();
  }

  async selectImageSeries(seriesNumber: number) {
    if (seriesNumber === 1) {
      await this.series1Button.click();
    } else {
      await this.series2Button.click();
    }
  }

  //temporary solution to get number of images in a series
  async getNumberOfImages(seriesNumber: number): Promise<number> {
    let selectedSeries: Locator;
    //to do: make it dynamic to support any series number
    switch (seriesNumber) {
      case 1:
        selectedSeries = this.series1Button;
        break;
      case 2:
        selectedSeries = this.series2Button;
        break;
      default:
        throw new Error(`Series ${seriesNumber} is not supported yet.`);
    }

    const seriesInfoText = await selectedSeries.innerText();
    const matchNrImages = seriesInfoText.match(/(\d+)\s+images?/i);
    const imageCount = matchNrImages ? parseInt(matchNrImages[1], 10) : 0;

    console.log(`Series ${seriesNumber} has ${imageCount} images.`);
    return imageCount;
  }

  async isSeriesHighlighted(seriesNumber: number) {
    if (seriesNumber === 1) {
      //const series1isHighlighted = await this.series1Button.getAttribute('class');
      //expect(series1isHighlighted).toContain('bg-blue-600');
      await expect(this.series1Button).toHaveClass(/\bbg-blue-600\b/);
    } else {
      const series2isHighlighted = await this.series2Button.getAttribute('class');
      expect(series2isHighlighted).toContain('bg-blue-600');
      // await expect(this.series2Button).toHaveClass('bg-blue-600');
    }
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
}
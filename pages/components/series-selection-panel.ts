import { expect, Locator, Page } from '@playwright/test';
import { ImageRenderedDetails } from '../../models/image-details';

export class SeriesPanel {
  readonly page: Page;
  private readonly seriesSelectionPanel: Locator;
  private readonly seriesButtons: Locator;
  readonly currentSeriesInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.seriesSelectionPanel = page.getByTestId('series-selection-panel');
    this.seriesButtons = this.seriesSelectionPanel.locator('[data-testid^="series-"][data-testid$="-button"]');
    this.currentSeriesInfo = page.getByTestId('current-series-info');
  }

  async getSeriesButton(seriesNumber: number) {
    return this.seriesSelectionPanel.getByTestId(`series-${seriesNumber}-button`);
  }

  async getNumberOfSeries(): Promise<number> {
    const buttons = await this.page.locator('[data-testid^="series-"]').all();
    return buttons.length;
  }

  async selectImageSeries(seriesNumber: number) {
    const seriesButton = await this.getSeriesButton(seriesNumber);
    await seriesButton.click();
  }

  async isSeriesHighlighted(seriesNumber: number) {
    const seriesButton = await this.getSeriesButton(seriesNumber);
    await expect(seriesButton).toHaveClass(/\bbg-blue-600\b/);
  }

  //compared with isSeriesHighlighted, it also checks that the other series is gray
  //nice to have as alternative: visual testing
  //this method also supports dynamic number of series
  async verifySeriesHighlighted(seriesNumber: number) {
    const buttonsCount = await this.getSeriesCount();

    for (let i = 0; i < buttonsCount; i++) {
      const currentButton = this.seriesButtons.nth(i);
      if (i + 1 === seriesNumber) {
        await expect(currentButton).toHaveClass(/\bbg-blue-600\b/);
      }
      else {
        await expect(currentButton).toHaveClass(/\bbg-gray-700\b/);
      }
    }

    //alternative, although doesn't cover the specifity of the requirement: 
    // "Test that series highlighting (blue selection) updates correctly"
    //await expect(currentButton).toHaveAttribute('aria-pressed', 'true'); // and 'false' otherwise
  }

  async getNumberOfImages(seriesNumber: number): Promise<number> {
    const seriesButton = await this.getSeriesButton(seriesNumber);

    const seriesInfoText = await seriesButton.innerText();
    const matchNrImages = seriesInfoText.match(/(\d+)\s+images?/i);
    const imageCount = matchNrImages ? parseInt(matchNrImages[1], 10) : 0;

    console.log(`Series ${seriesNumber} has ${imageCount} images.`);
    return imageCount;
  }

  async getSeriesCount(): Promise<number> {
    return this.seriesButtons.count();
  }

  async expectSeriesInfoToMatch(renderedDetails: ImageRenderedDetails, totalImagesInSeries: number) {
    const infoText = await this.currentSeriesInfo.innerText();
    const imageFormat = renderedDetails.imageSource.split('.').pop()?.toUpperCase() ?? 'UNKNOWN';

    expect(infoText, `Series info text should contain 'Series ${renderedDetails.series}'`).toContain(`Series ${renderedDetails.series}`);
    expect(infoText, `Series info text should contain the format '${imageFormat}'`).toContain(imageFormat);
    
    const indexMatch = infoText.match(/Image\s+(\d+)\s+of\s+(\d+)/);
    expect(indexMatch, 'Series info text should contain the image index in "Image X of Y" format').not.toBeNull();

    const currentIndex = parseInt(indexMatch![1]);
    const total = parseInt(indexMatch![2]);

    expect(currentIndex, 'Current image index in series info should match event data').toBe(renderedDetails.imageIndex + 1 );
    expect(total, 'Total images in series info should match expected total').toBe(totalImagesInSeries);
  }
}

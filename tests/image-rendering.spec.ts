import { test } from '../fixtures/image-viewer-fixtures';

/*
1. Correctness of Rendering of Images
Verify that images load correctly from both series (Series 1: JPEG format, Series 2: JPEG format) doing an image
comparison.
*/

const seriesToTest: (1 | 2)[] = [1, 2];

//Test suite performs visual comparison using PLaywright toHaveScreenshot() method for each of the image for both series
test.describe('Feature: Image Rendering', () => {

  seriesToTest.forEach(series => {
    test(`each image of Series ${series} should be rendered correctly`, async ({ viewerPage }) => {
      await viewerPage.seriesPanel.selectImageSeries(series);
      await viewerPage.seriesPanel.isSeriesHighlighted(series);

      const nrImages = await viewerPage.seriesPanel.getNumberOfImages(series);

      for (let i = 1; i <= nrImages; i++) {

        await viewerPage.hideOverlaysForScreenshot();
        await viewerPage.imageViewer.compareImageScreenshot(series, i);

        await viewerPage.imageViewer.scrollMouseWheel('down');
      }
    });
  });
});

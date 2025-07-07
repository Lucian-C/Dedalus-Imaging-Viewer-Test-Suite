import { test, expect } from '@playwright/test';
import { ImageViewerPage } from '../pages/image-viewer-page';

/*
1. Correctness of Rendering of Images
Verify that images load correctly from both series (Series 1: JPEG format, Series 2: JPEG format) doing an image
comparison.
*/

//Test suite performs visual comparison using PLaywright toHaveScreenshot() method for each of the image for both series
test.describe('Feature: Image Rendering', () => {
  let medicalViewer: ImageViewerPage;

  // Load the app before each test and accept the Welcome disclaimer
  test.beforeEach(async ({ page }) => {
    medicalViewer = new ImageViewerPage(page);
    await medicalViewer.goto();
    await medicalViewer.closeWelcomePopup();
    await expect(medicalViewer.welcomePopup).toBeHidden();
  });

  [1, 2].forEach(series => {
    test(`each image of Series ${series} should be rendered correctly`, async () => {
      await medicalViewer.selectImageSeries(series);
      await medicalViewer.isSeriesHighlighted(series);
      const nrImages = await medicalViewer.getNumberOfImages(series);
      for (let i = 1; i <= nrImages; i++) {
        await medicalViewer.compareImages(series, i);
        await medicalViewer.scrollMouseWheel('down');
      }
    });
  });
});

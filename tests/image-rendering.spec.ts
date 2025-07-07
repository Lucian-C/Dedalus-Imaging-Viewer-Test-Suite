import { test, expect } from '@playwright/test';
import { ImageViewerPage } from '../pages/image-viewer-page';

/*
1. Correctness of Rendering of Images
Verify that images load correctly from both series (Series 1: JPEG format, Series 2: JPEG format) doing an image
comparison.
*/

//Test suite performs visual comparison using PLaywright toHaveScreenshot() method for each of the image for both series
test.describe('Imaging Viewer Test Suite', () => {
  let medicalViewer: ImageViewerPage;

  // Load the app before each test and accept the Welcome disclaimer
  test.beforeEach(async ({ page }) => {
    medicalViewer = new ImageViewerPage(page);
    await medicalViewer.goto();
    await medicalViewer.closeWelcomePopup();
    await expect(medicalViewer.welcomePopup).toBeHidden();
  });

  test.describe('Feature: Image Rendering', () => {
    test('should render the each image of Series 1 correctly', async () => {
      await medicalViewer.selectImageSeries(1);
      await medicalViewer.isSeriesHighlighted(1);
      const nrImages = await medicalViewer.getNumberOfImages(1);
      for (let i = 1; i <= nrImages; i++) {
        await medicalViewer.compareImages(1, i);
        await medicalViewer.scrollMouseWheel('down');
      }
    });
  });

  test.describe('Feature: Image Rendering', () => {
    test('should render the each image of Series 2 correctly', async () => {
      await medicalViewer.selectImageSeries(2);
      await medicalViewer.isSeriesHighlighted(2);
      const nrImages = await medicalViewer.getNumberOfImages(2);
      for (let i = 1; i <= nrImages; i++) {
        await medicalViewer.compareImages(2, i);
        await medicalViewer.scrollMouseWheel('down');
      }
    });
  });
});

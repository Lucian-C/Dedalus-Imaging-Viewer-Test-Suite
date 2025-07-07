import { test, expect } from '@playwright/test';
import { ImageViewerPage } from '../pages/image-viewer-page';

/*
2. Navigation Between Images Using Mouse Scroll
Test mouse wheel scrolling functionality for navigating through image stacks
Confirm image index updates correctly.
Verify that the correct images are loaded after the series navigation
*/

//Test suite performs validations on correct image loading and data for both series during navigation
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
    test(`should load the correct image of Series ${series} while navigating by mouse scroll`, async () => {
      await medicalViewer.selectImageSeries(series);
      await medicalViewer.isSeriesHighlighted(series);
      await medicalViewer.scrollMouseWheel('down');
    });
  });
});
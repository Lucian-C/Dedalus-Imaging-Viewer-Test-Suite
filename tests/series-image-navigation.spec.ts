import { test, expect } from '@playwright/test';
import { ImageViewerPage } from '../pages/image-viewer-page';

/*
2. Navigation Between Images Using Mouse Scroll
Test mouse wheel scrolling functionality for navigating through image stacks
Confirm image index updates correctly.
Verify that the correct images are loaded after the series navigation
*/

const seriesToTest: (1 | 2)[] = [1, 2];
const directionsToTest: ('up' | 'down')[] = ['up', 'down'];

//Test suite performs validations on correct image loading and data for both series during navigation
test.describe('Feature: Navigation Between Images', () => {
  let medicalViewer: ImageViewerPage;

  // Load the app before each test and accept the Welcome disclaimer
  test.beforeEach(async ({ page }) => {
    medicalViewer = new ImageViewerPage(page);
    await medicalViewer.goto();
    await medicalViewer.closeWelcomePopup();
    await expect(medicalViewer.welcomePopup).toBeHidden();
  });

  seriesToTest.forEach(seriesNumber => {
    directionsToTest.forEach(direction => {

      //[1, 2].forEach(series => {
      // first draft: to be refactored
      test(`should load the correct image for Series ${seriesNumber} after navigating scrolling ${direction} using the mouse`, async () => {
        await medicalViewer.selectImageSeries(seriesNumber);
        await medicalViewer.verifySeriesHighlighted(seriesNumber);

        const nrImages = await medicalViewer.getNumberOfImages(seriesNumber);
        if (direction === 'down') {
          for (let i = 1; i <= nrImages; i++) {
            const currentRenderedImage = await medicalViewer.waitForImageRendered();
            console.log(currentRenderedImage);

            const currentImage = medicalViewer.currentImage;
            const imageAltText = await currentImage.getAttribute('alt');
            const imageSource = await currentImage.getAttribute('src');

            expect(imageAltText).toContain(`slice ${currentRenderedImage.imageIndex + 1}`);
            expect(imageAltText).toContain(`Series ${currentRenderedImage.series}`);
            expect(imageSource).toContain(currentRenderedImage.imageSource);

            await medicalViewer.scrollMouseWheel(direction);
          }
        }
        else {
          for (let i = 1; i <= nrImages; i++) {
            await medicalViewer.scrollMouseWheel('down');
          }
          for (let i = nrImages - 1; i >= 1; i--) {
            const currentRenderedImage = await medicalViewer.waitForImageRendered();
            console.log(currentRenderedImage);

            const currentImage = medicalViewer.currentImage;
            const imageAltText = await currentImage.getAttribute('alt');
            const imageSource = await currentImage.getAttribute('src');

            expect(imageAltText).toContain(`slice ${currentRenderedImage.imageIndex + 1}`);
            expect(imageAltText).toContain(`Series ${currentRenderedImage.series}`);
            expect(imageSource).toContain(currentRenderedImage.imageSource);

            await medicalViewer.scrollMouseWheel(direction);
          }
        }
      });
    });
  });
});
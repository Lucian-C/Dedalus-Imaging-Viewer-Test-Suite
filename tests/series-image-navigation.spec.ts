import { test, expect } from '../fixtures/image-viewer-fixtures';

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

  seriesToTest.forEach(seriesNumber => {
    directionsToTest.forEach(direction => {
      test(`should load the correct image for Series ${seriesNumber} after navigating scrolling ${direction} using the mouse`, async ({ viewerPage }) => {
        await viewerPage.seriesPanel.selectImageSeries(seriesNumber);
        await viewerPage.seriesPanel.verifySeriesHighlighted(seriesNumber);

        const nrImages = await viewerPage.seriesPanel.getNumberOfImages(seriesNumber);
        if (direction === 'down') {
          for (let i = 1; i <= nrImages; i++) {
            const currentRenderedImageDetails = await viewerPage.imageViewer.waitForImageRendered();
            console.log(currentRenderedImageDetails);

            await viewerPage.imageViewer.expectImageAttributesToMatch(currentRenderedImageDetails);

            await viewerPage.imageViewer.scrollMouseWheel(direction);
          }
        }
        else {
          for (let i = 1; i <= nrImages; i++) {
            await viewerPage.imageViewer.scrollMouseWheel('down');
          }
          for (let i = nrImages - 1; i >= 1; i--) {
            const currentRenderedImageDetails = await viewerPage.imageViewer.waitForImageRendered();
            console.log(currentRenderedImageDetails);

            await viewerPage.imageViewer.expectImageAttributesToMatch(currentRenderedImageDetails);

            await viewerPage.imageViewer.scrollMouseWheel(direction);
          }
        }
      });
    });
  });
});
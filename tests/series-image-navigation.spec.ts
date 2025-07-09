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

        const totalImages = await viewerPage.seriesPanel.getNumberOfImages(seriesNumber);
        if (direction === 'down') {
          for (let i = 1; i <= totalImages; i++) {
            const currentRenderedImageDetails = await viewerPage.imageViewer.waitForImageRendered();
            console.log(`Series ${seriesNumber}, Scrolling in direction ${direction}, Image details:`, currentRenderedImageDetails);

            await viewerPage.imageViewer.expectImageAttributesToMatch(currentRenderedImageDetails);
            await viewerPage.imageViewer.navigationInstructionsIsVisible();

            await viewerPage.imageViewer.scrollMouseWheel(direction);
          }
        }
        else {
          for (let i = 1; i <= totalImages; i++) {
            await viewerPage.imageViewer.scrollMouseWheel('down');
          }
          for (let i = totalImages - 1; i >= 1; i--) {
            const currentRenderedImageDetails = await viewerPage.imageViewer.waitForImageRendered();
            console.log(`Series ${seriesNumber}, Scrolling in direction ${direction}, Image details:`, currentRenderedImageDetails);

            await viewerPage.imageViewer.expectImageAttributesToMatch(currentRenderedImageDetails);
            await viewerPage.imageViewer.navigationInstructionsIsVisible();

            await viewerPage.imageViewer.scrollMouseWheel(direction);
          }
        }
      });
    });

    // Navigate through the series images using the Navigation buttons
    test(`should load the correct image for Series ${seriesNumber} after navigating using the buttons`, async ({ viewerPage }) => {
      await viewerPage.seriesPanel.selectImageSeries(seriesNumber);
      await viewerPage.seriesPanel.verifySeriesHighlighted(seriesNumber);

      const totalImages = await viewerPage.seriesPanel.getNumberOfImages(seriesNumber);

      // First navigate towards the end = click "Next" button
      for (let i = 1; i <= totalImages; i++) {
        const currentRenderedImageDetails = await viewerPage.imageViewer.waitForImageRendered();
        console.log(`Button navigation, 'Next': Series ${seriesNumber}, Image ${i}:`, currentRenderedImageDetails);

        await viewerPage.imageViewer.expectImageAttributesToMatch(currentRenderedImageDetails);

        if (i < totalImages) {
          await viewerPage.navigationButtons.nextImage();
        }
      }
      // Validate Next button is disabled 
      await viewerPage.navigationButtons.nextIsDisabled();

      // Navigate back to the start = click "Previous" button 
      for (let i = totalImages; i > 1; i--) {

        if (i > 1) {
          await viewerPage.navigationButtons.previousImage();
        }

        const currentRenderedImageDetails = await viewerPage.imageViewer.waitForImageRendered();
        console.log(`Button navigation, 'Previous': Series ${seriesNumber}, Image ${i}:`, currentRenderedImageDetails);

        await viewerPage.imageViewer.expectImageAttributesToMatch(currentRenderedImageDetails);
      }

      // Validate Previous button is disabled       
      await viewerPage.navigationButtons.previousIsDisabled();
    });
  });
});
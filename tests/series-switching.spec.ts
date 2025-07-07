import { test, expect } from '@playwright/test';
import { ImageViewerPage } from '../pages/image-viewer-page';

/*
3. Switch of Series
Test switching between Series 1 (7 JPEG images) and Series 2 (6 JPEG images)
Validate that image index resets to 1 when switching series
Confirm that the current series information updates in the left panel
Verify that the correct images are loaded for each series
Test that series highlighting (blue selection) updates correctly
*/


// Test suite performs validations on correct image loading and data for both series when switching between Series
// Series highlighting and images being loaded are validated under Feature: Navigation Between Images and Feature: Image Rendering
// TBD if extending the other test or refactoring to isolate each behaviour
test.describe('Feature: Switching Between Series', () => {
  let medicalViewer: ImageViewerPage;

  // Load the app before each test and accept the Welcome disclaimer
  test.beforeEach(async ({ page }) => {
    medicalViewer = new ImageViewerPage(page);
    await medicalViewer.goto();
    await medicalViewer.closeWelcomePopup();
    await expect(medicalViewer.welcomePopup).toBeHidden();
  });

  [1, 2].forEach(seriesNumber => {
    test(`the correct image information is updated and index resets for current series information when switching, starting from Series ${seriesNumber}`, async () => {
      // Select initial Series and verify highlight
      const otherSeries = seriesNumber === 1 ? 2 : 1; // hardcoded switch value - to be improved for dynamic number of Series
      await medicalViewer.selectImageSeries(seriesNumber);
      await medicalViewer.verifySeriesHighlighted(seriesNumber);

      const nrImages = await medicalViewer.getNumberOfImages(seriesNumber);
      // For each rendered image in the selected series, check the current series information in the left panel
      for (let i = 1; i <= nrImages; i++) {
        const currentRenderedImage = await medicalViewer.waitForImageRendered();
        const expectedSeries = currentRenderedImage.series;
        const expectedIndex = currentRenderedImage.imageIndex + 1;
        const expectedFormat = currentRenderedImage.imageSource.split('.').pop()?.toUpperCase() || 'UNKNOWN';
        console.log(currentRenderedImage);

        const currentSeriesInformation = medicalViewer.currentSeriesInfo;

        const seriesNameText = await currentSeriesInformation.innerText();
        expect(seriesNameText).toContain(`Series ${expectedSeries}`);
        expect(seriesNameText).toContain(expectedFormat);

        const indexText = await currentSeriesInformation.innerText();
        const match = indexText.match(/Image\s+(\d+)\s+of\s+(\d+)/i);
        expect(match).not.toBeNull();

        const current = parseInt(match![1]);
        const total = parseInt(match![2]);

        expect(current).toBe(expectedIndex);
        expect(total).toBe(nrImages);

        // After validating the data, switch series to verify the index resets to 1, before scrolling back and continuing
        // Code duplication - to be moved in helper class
        await medicalViewer.selectImageSeries(otherSeries);
        const resetSeriesInformation = medicalViewer.currentSeriesInfo;
        const resetIndexText = await resetSeriesInformation.innerText();
        const resetMatch = resetIndexText.match(/Image\s+(\d+)\s+of\s+(\d+)/i);
        const reset = parseInt(resetMatch![1]);
        expect(reset).toBe(1);
        await medicalViewer.selectImageSeries(seriesNumber);
        for (let j = 1; j <= i; j++) {
          await medicalViewer.scrollMouseWheel('down');
        }

        await medicalViewer.scrollMouseWheel('down');
      }
    });
  });
});
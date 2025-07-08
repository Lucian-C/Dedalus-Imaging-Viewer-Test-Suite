import { test, expect } from '../fixtures/image-viewer-fixtures';

/*
3. Switch of Series
Test switching between Series 1 (7 JPEG images) and Series 2 (6 JPEG images)
Validate that image index resets to 1 when switching series
Confirm that the current series information updates in the left panel
Verify that the correct images are loaded for each series
Test that series highlighting (blue selection) updates correctly
*/

//To Do: Add visual regression for selected series.

const seriesToTest: (1 | 2)[] = [1, 2];

// Test suite performs validations on correct image loading and data for both series when switching between Series
test.describe('Feature: Switching Between Series', () => {

  seriesToTest.forEach(seriesNumber => {
    test(`should load the correct image information navigating through Series ${seriesNumber}`, async ({ viewerPage }) => {
      // Select initial Series and verify highlight
      await viewerPage.seriesPanel.selectImageSeries(seriesNumber);
      await viewerPage.seriesPanel.isSeriesHighlightedWithScreenshot(seriesNumber);

      const totalImages = await viewerPage.seriesPanel.getNumberOfImages(seriesNumber);
      // For each rendered image in the selected series, check the current series information in the left panel
      for (let i = 1; i <= totalImages; i++) {
        const imageDetails = await viewerPage.imageViewer.waitForImageRendered();
        console.log(imageDetails);

        await viewerPage.seriesPanel.expectSeriesInfoToMatch(imageDetails, totalImages);

        await viewerPage.imageViewer.scrollMouseWheel('down');
      }
    });
  });

  test('should reset image index to 1 when switching series', async ({ viewerPage }) => {
    // Select initial Series and verify highlight
    await viewerPage.seriesPanel.selectImageSeries(1);
    await viewerPage.seriesPanel.isSeriesHighlightedWithScreenshot(1);

    // Scroll to third image to have index 2
    await viewerPage.imageViewer.scrollMouseWheel('down');
    await viewerPage.imageViewer.scrollMouseWheel('down');

    let imageDetails = await viewerPage.imageViewer.waitForImageRendered();
    expect(imageDetails.imageIndex).toBe(2);

    // Switch to Series 2 and verify highlight
    await viewerPage.seriesPanel.selectImageSeries(2);
    imageDetails = await viewerPage.imageViewer.waitForImageRendered();
    
    // Verify index reseting
    expect(imageDetails.series).toBe(2);
    expect(imageDetails.imageIndex, 'Index should reset to 1 after switching series').toBe(0);
  });
  
  test('patient information persists when switching between series', async ({ viewerPage }) => {
    // Select initial Series and get patient Info
    await viewerPage.seriesPanel.selectImageSeries(1);
    const initialDetails = await viewerPage.imageViewer.waitForImageRendered();
    const expectedPatientInfo = initialDetails.patientInfo;
    
    await viewerPage.patientInfo.expectInfoToMatch(expectedPatientInfo);    

    // Switch to Series 2 and verify patient Info is the same
    await viewerPage.seriesPanel.selectImageSeries(2);
    await viewerPage.imageViewer.waitForImageRendered();
    
    await viewerPage.patientInfo.expectInfoToMatch(expectedPatientInfo);
  });
});
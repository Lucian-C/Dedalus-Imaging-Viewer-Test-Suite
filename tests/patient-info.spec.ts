import { test, expect } from '../fixtures/image-viewer-fixtures';

/*
4. Verify Patient Information Overlay Displays Correct Data
Validate that patient name and ID are correctly displayed in the bottom-left overlay
Test that patient information persists across series switches
*/

const seriesToTest: (1 | 2)[] = [1, 2];

// Test suite performs validation of Patient Information Overlay data when switching between Series and image navigation
test.describe('Feature: Patient Information Overlay', () => {

  seriesToTest.forEach(series => {
    test(`patient information overlay displays correct data while navigating images for Series ${series}`, async ({ viewerPage }) => {
      await viewerPage.seriesPanel.selectImageSeries(series);
      await viewerPage.seriesPanel.isSeriesHighlighted(series);

      const totalImages = await viewerPage.seriesPanel.getNumberOfImages(series);
      for (let i = 1; i <= totalImages; i++) {
        const currentRenderedImage = await viewerPage.imageViewer.waitForImageRendered();
        console.log(currentRenderedImage);

        await viewerPage.patientInfo.validatePatientInfo(currentRenderedImage, totalImages);

        await viewerPage.imageViewer.scrollMouseWheel('down');
      }
    });
  });

  test(`patient information persists after swithcing between series`, async ({ viewerPage }) => {
    //Start with Series 1
    await viewerPage.seriesPanel.selectImageSeries(1);
    await viewerPage.seriesPanel.isSeriesHighlighted(1);
    const totalImages = await viewerPage.seriesPanel.getNumberOfImages(1);
    const initialPatientName= viewerPage.patientInfo.getPatientName;
    const initialPatientId = viewerPage.patientInfo.getPatientId;

    const currentRenderedImage = await viewerPage.imageViewer.waitForImageRendered();
    console.log(currentRenderedImage);

    await viewerPage.patientInfo.validatePatientInfo(currentRenderedImage, totalImages);

    //switch to Series 2
    await viewerPage.seriesPanel.selectImageSeries(2);
    await viewerPage.seriesPanel.isSeriesHighlighted(2);

    //Get again the Patient Information Overlay Info to verify the new data aginst the initial data
    const newPatientName = viewerPage.patientInfo.getPatientName;
    const newPatientId = viewerPage.patientInfo.getPatientId;

    expect(newPatientName).toBe(initialPatientName);
    expect(newPatientId).toBe(initialPatientId);
  });

  //nice to have
  test(`simulate user login and get patient information from storageState`, async ({ viewerPage }) => {
  });
});
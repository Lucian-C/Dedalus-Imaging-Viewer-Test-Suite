import { test, expect } from '@playwright/test';
import { ImageViewerPage } from '../pages/image-viewer-page';

/*
4. Verify Patient Information Overlay Displays Correct Data
Validate that patient name and ID are correctly displayed in the bottom-left overlay
Test that patient information persists across series switches
*/

// Test suite performs validation of Patient Information Overlay data when switching between Series and image navigation
test.describe('Feature: Patient Information Overlay', () => {
  let medicalViewer: ImageViewerPage;

  // Load the app before each test and accept the Welcome disclaimer
  test.beforeEach(async ({ page }) => {
    medicalViewer = new ImageViewerPage(page);
    await medicalViewer.goto();
    await medicalViewer.closeWelcomePopup();
    await expect(medicalViewer.welcomePopup).toBeHidden();
  });

  [1, 2].forEach(series => {
    test(`patient information overlay displays correct data while navigating images for Series ${series}`, async () => {
      await medicalViewer.selectImageSeries(series);
      await medicalViewer.isSeriesHighlighted(series);

      const patientInfoOverlay = medicalViewer.patientInformationOverlay;
      const patientName = patientInfoOverlay.getByTestId('patient-name');
      const patientId = patientInfoOverlay.getByTestId('patient-id');

      const nrImages = await medicalViewer.getNumberOfImages(series);
      for (let i = 1; i <= nrImages; i++) {
        const currentRenderedImage = await medicalViewer.waitForImageRendered();
        console.log(currentRenderedImage);

        expect(patientName).toHaveText(currentRenderedImage.patientInfo.name);
        expect(patientId).toHaveText(currentRenderedImage.patientInfo.id);

        await medicalViewer.scrollMouseWheel('down');
      }
    });
  });

  test(`patient information persists after swithcing between series`, async () => {
    //Start with Series 1
    await medicalViewer.selectImageSeries(1);
    await medicalViewer.isSeriesHighlighted(1);

    const patientInfoOverlay = medicalViewer.patientInformationOverlay;
    const patientName = patientInfoOverlay.getByTestId('patient-name');
    const patientId = patientInfoOverlay.getByTestId('patient-id');

    const currentRenderedImage = await medicalViewer.waitForImageRendered();
    console.log(currentRenderedImage);

    expect(patientName).toHaveText(currentRenderedImage.patientInfo.name);
    expect(patientId).toHaveText(currentRenderedImage.patientInfo.id);

    //switch to Series 2
    await medicalViewer.selectImageSeries(2);
    await medicalViewer.isSeriesHighlighted(2);
 
    //Instantiate again the Patient Information Overlay to verify the new data
    const newPatientInfoOverlay = medicalViewer.patientInformationOverlay;
    const newPatientName = newPatientInfoOverlay.getByTestId('patient-name').innerText;
    const newPatientId = patientInfoOverlay.getByTestId('patient-id').innerText;

    expect(newPatientName).toBe(patientName.innerText);
    expect(newPatientId).toBe(patientId.innerText);
  });

  //nice to have
  test(`simulate user login and get patient information from storageState`, async () => {
  });
});
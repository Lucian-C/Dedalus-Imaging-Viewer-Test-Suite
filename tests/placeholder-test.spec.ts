import { test, expect } from '@playwright/test';

/*
1. Correctness of Rendering of Images
Verify that images load correctly from both series (Series 1: JPEG format, Series 2: JPEG format) doing an image
comparison.

2. Navigation Between Images Using Mouse Scroll
Test mouse wheel scrolling functionality for navigating through image stacks
Confirm image index updates correctly.
Verify that the correct images are loaded after the series navigation

3. Switch of Series
Test switching between Series 1 (7 JPEG images) and Series 2 (6 JPEG images)
Validate that image index resets to 1 when switching series
Confirm that the current series information updates in the left panel
Verify that the correct images are loaded for each series
Test that series highlighting (blue selection) updates correctly

4. Verify Patient Information Overlay Displays Correct Data
Validate that patient name and ID are correctly displayed in the bottom-left overlay
Test that patient information persists across series switches
*/

test('placeholder test', async ({ page }) => {
  //go to app page
  await page.goto('https://diit-playwright-qa-test.vercel.app/');

  //accept disclaimer
  await page.getByRole('button', { name: 'disclaimer' }).click();

  //select series 1 images 
  await page.getByTestId('series-1-button').click();

  //check button is blue (highlighted)
  var series1isHighlighted = await page.getByTestId('series-1-button').getAttribute('class');
  expect(series1isHighlighted).toContain('bg-blue-600');

  //check image is rendered 
  //placeholder steps and timeouts before adding addEventListener for imagerendered
  await page.waitForTimeout(1000);
  var patientInfoOverlay = page.locator('[data-testid="patient-information-overlay"]');
  await patientInfoOverlay.evaluate(element => element.style.display = 'none');
  
  var medicalImage = page.getByTestId('medical-image');
  expect(medicalImage).toHaveScreenshot('1_1.png');

  await page.waitForTimeout(1000);
  await patientInfoOverlay.evaluate(element => element.style.display = '');

  //check scroll changes image  
  await page.getByTestId('medical-image-viewport').hover();
  await page.mouse.wheel(0, 10);
  expect(page.getByAltText('Medical slice 2')).toBeVisible;

  //select series 2 and check highlighted
  await page.getByTestId('series-2-button').click();
  var series2isHighlighted = await page.getByTestId('series-2-button').getAttribute('class');
  expect(series2isHighlighted).toContain('bg-blue-600');

  //check patient data present (using hadrcoded values)
  expect(page.getByTestId('patient-name')).toHaveText('John Doe');
  expect(page.getByTestId('patient-id')).toHaveText('P001234567');  
});
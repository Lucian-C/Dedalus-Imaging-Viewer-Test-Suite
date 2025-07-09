import { test, expect } from '../fixtures/image-viewer-fixtures';

//To Do: record loadDelay everytime the event is triggered

const seriesToTest: (1 | 2)[] = [1, 2];

test.describe('Performance Tests: ', () => {

  seriesToTest.forEach(seriesNumber => {
    // Since loadDelay is randomised this will cause random failures - candidate for flakyness
    // Chose 1400ms since 1500 doesn't result in many failures and values below 1400 always result in a failure = added as test paramater to be left open to extension
    [1400].forEach(expectedTime => {
      test(`should load images in Series ${seriesNumber} with an expected load delay below ${expectedTime}`, async ({ viewerPage }) => {
        await viewerPage.seriesPanel.selectImageSeries(seriesNumber);
        const totalImages = await viewerPage.seriesPanel.getNumberOfImages(seriesNumber);

        for (let i = 1; i <= totalImages; i++) {
          const iamgeDetails = await viewerPage.imageViewer.waitForImageRendered();
          
          //Validate the loadDelay value for each image in the series
          expect(iamgeDetails.loadDelay, `loadDelay for Image ${i} in Series 1 should be under`).toBeLessThan(expectedTime);

          await viewerPage.imageViewer.scrollMouseWheelWithLoadingTime('down');
        }

      });
    });

    // Test quick navigation to last image and that total duration is under a predefined expected value = added as test paramater to be left open to extension
    [1500].forEach(expectedTimeDuration => {
      test(`should complete a quick image navigation for Series ${seriesNumber} within an expected time of ${expectedTimeDuration}`, async ({ viewerPage }) => {
        await viewerPage.seriesPanel.selectImageSeries(seriesNumber);
        const totalImages = await viewerPage.seriesPanel.getNumberOfImages(seriesNumber);

        // Save starting time before scrolling
        const startTime = performance.now(); 

        // Scroll continuosly to last image in Series
        for (let i = 1; i <= totalImages; i++) {
          await viewerPage.imageViewer.scrollMouseWheel('down');
        }

        //Get the total time after the last image render event
        const finalImageDetails = await viewerPage.imageViewer.waitForImageRendered();
        const totalTime = performance.now() - startTime;

        console.log(`Navigation of ${totalImages} images took ${totalTime.toFixed(2)}ms`);

        // Check that current image is the last one based on index
         expect(finalImageDetails.imageIndex, `Expected last image index to be ${totalImages - 1}`).toBe(totalImages - 1);
        
        // Validate the total time 
        expect(totalTime, `Expected navigation time to be less than ${expectedTimeDuration}ms`).toBeLessThan(expectedTimeDuration);
      
      });
    });
    
    test(`should record image network download times for Series ${seriesNumber}`, async ({ viewerPage }) => {
      await viewerPage.seriesPanel.selectImageSeries(seriesNumber);
      const totalImages = await viewerPage.seriesPanel.getNumberOfImages(seriesNumber);

      const imageDownloadTimings: { url: string, duration: number }[] = [];
      const requestStartTimes = new Map<string, number>();

      viewerPage.page.on('request', request => {
        if (request.resourceType() === 'image') {
          requestStartTimes.set(request.url(), Date.now());
        }
      });

      viewerPage.page.on('response', response => {
        if (response.request().resourceType() === 'image') {
          const start = requestStartTimes.get(response.url());
          if (start) {
            const downloadDuration = Date.now() - start;
            imageDownloadTimings.push({ url: response.url(), duration: downloadDuration });
            console.log(`Image ${response.url()} downloaded in ${downloadDuration} ms`);
          }
        }
      });

      for (let i = 1; i <= totalImages; i++) {
        await viewerPage.imageViewer.waitForImageRendered();
        await viewerPage.imageViewer.scrollMouseWheel('down');
      }

      imageDownloadTimings.forEach(img =>
        expect(img.duration, `Image ${img.url} should download in under 1000ms`).toBeLessThan(1000)
      );
    });
  });
});
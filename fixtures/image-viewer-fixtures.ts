import { test as baseTest } from '@playwright/test';
import { ViewerPage } from '../pages/viewer-page';

type pageFixtures = {
  viewerPage: ViewerPage;
};

export const test = baseTest.extend<pageFixtures>({
  viewerPage: async ({ page }, use) => {

    const viewerPage = new ViewerPage(page);

    await viewerPage.goto();
    await viewerPage.welcomePopup.accept();
    
    await use(viewerPage);
  },
});

export { expect } from '@playwright/test';
import { Page } from '@playwright/test';
import { WelcomePopup } from './components/welcome-popup';
import { SeriesPanel } from './components/series-selection-panel';
import { ImageViewer } from './components/image-viewer';
import { PatientInfoOverlay } from './components/patient-info';
import { NavigationButtons } from './components/navigation-buttons';

export class ViewerPage {
  readonly page: Page;
  readonly welcomePopup: WelcomePopup;
  readonly seriesPanel: SeriesPanel;
  readonly imageViewer: ImageViewer;
  readonly patientInfo: PatientInfoOverlay;
  readonly navigationButtons: NavigationButtons;

  constructor(page: Page) {      
    this.page = page;
    this.welcomePopup = new WelcomePopup(page);
    this.seriesPanel = new SeriesPanel(page);
    this.imageViewer = new ImageViewer(page);
    this.patientInfo = new PatientInfoOverlay(page);
    this.navigationButtons = new NavigationButtons(page);
  }  

  async goto() {
    await this.page.goto('/');
  }
  
  async hideOverlaysForScreenshot() {
    await this.patientInfo.overlay.evaluate(el => el.style.display = 'none');
    await this.imageViewer.navInstructions.evaluate(el => el.style.display = 'none');
    await this.navigationButtons.navButtons.evaluate(el => el.style.display = 'none');
  }
}

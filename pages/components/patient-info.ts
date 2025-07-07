import { expect, Locator, Page } from '@playwright/test';
import { ImageRenderedDetails, PatientInfo } from '../../models/image-details';

export class PatientInfoOverlay {
  readonly overlay: Locator;
  private readonly patientName: Locator;
  private readonly patientId: Locator;

   constructor(page: Page) {
    this.overlay = page.getByTestId('patient-information-overlay');
    this.patientName = this.overlay.getByTestId('patient-name');
    this.patientId = this.overlay.getByTestId('patient-id');
  }

  async getPatientName(): Promise<string> {
    return this.patientName.innerText();
  }

  async getPatientId(): Promise<string> {
    return this.patientId.innerText();
  }

  async expectInfoToMatch(expected: PatientInfo) {
    await expect(this.patientName).toHaveText(expected.name);
    await expect(this.patientId).toHaveText(expected.id);
  }

  async validatePatientInfo(expected: ImageRenderedDetails) {
    const name = await this.patientName.innerText();
    const id = await this.patientId.innerText();

    expect(name).toContain(expected.patientInfo.name);
    expect(id).toContain(expected.patientInfo.id);
  }
}

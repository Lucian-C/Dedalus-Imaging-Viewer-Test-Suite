import { expect, Locator, Page } from '@playwright/test';
import { ImageRenderedDetails, PatientInfo } from '../../models/image-details';

export class PatientInfoOverlay {
  readonly overlay: Locator;
  private readonly patientName: Locator;
  private readonly patientId: Locator;
  private readonly patientSliceInfo: Locator;

  constructor(page: Page) {
    this.overlay = page.getByTestId('patient-information-overlay');
    this.patientName = this.overlay.getByTestId('patient-name');
    this.patientId = this.overlay.getByTestId('patient-id');
    this.patientSliceInfo = this.overlay.getByTestId('slice-information');
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

  async validatePatientInfo(expected: ImageRenderedDetails, expectedSlices: number) {
    const sliceText = await this.patientSliceInfo.innerText();
    const slicesParts = sliceText.split('/');
    const currentSlice = parseInt(slicesParts[0].trim(), 10);
    const totalSlices = parseInt(slicesParts[1].trim(), 10);

    expect(this.patientName).toHaveText(expected.patientInfo.name);
    expect(this.patientId).toHaveText(expected.patientInfo.id);
    expect(currentSlice).toBe(expected.imageIndex + 1);
    expect(totalSlices).toBe(expectedSlices);
  }
}

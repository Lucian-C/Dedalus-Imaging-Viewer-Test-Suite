# Dedalus-Imaging-Viewer-Test-Suite

Automated testing suite for the DIIT image viewer application using Playwright with TypeScript. reporting.

## Features

- **Image Rendering Validation:** Ensures images from both series are rendered correctly.
- **Navigation Testing:** Verifies mouse wheel navigation through image stacks.
- **Series Switching:** Tests switching between image series and validates UI updates.
- **Patient Info Overlay:** Checks that patient information is displayed and persists correctly.
- **Performance Tests:** Measures image load times and navigation speed.

## Tech Stack

- [Playwright](https://playwright.dev/) for browser automation and testing
- [Allure](https://docs.qameta.io/allure/) for test reporting

## Project Structure

- `tests/` - Test suites for image rendering, navigation, series switching, patient info, and performance.
- `fixtures/` - Custom Playwright fixtures for the image viewer.
- `pages/` - Page Object Models for UI components.
- `allure-report/` - Generated Allure HTML reports.
- `allure-results/` - Raw results for Allure.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Install dependencies

```powershell
npm install
```

### Run tests

```powershell
npx playwright test
```

### Generate Allure report

```powershell
npx allure generate allure-results -o allure-report
npx allure open allure-report
```

## Configuration

- Test configuration: `playwright.config.ts`
- Base URL: `https://diit-playwright-qa-test.vercel.app`
- Tests run on Chromium and Firefox by default.

## Author

Lucian Cruceru

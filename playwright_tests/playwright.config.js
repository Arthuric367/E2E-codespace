/**
 * Playwright Test Configuration for E2E Communication Platform
 * Separate configuration for performance comparison with pytest
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
    ['json', { outputFile: 'reports/playwright-results.json' }],
    ['list']
  ],
  use: {
    baseURL: 'file://',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',  // Changed from 'Microsoft Edge'
      use: { 
        ...devices['Desktop Chrome'],  // Changed from 'Desktop Edge'
        channel: 'chromium'  // Use installed chromium
      },
    },
  ],
  outputDir: 'reports/test-results',
});

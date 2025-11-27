const { defineConfig } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: 'tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  reporter: [['html', { outputFolder: 'test-results' }], ['list']],
  use: {
    // Use Microsoft Edge for testing
    browserName: 'chromium',
    channel: 'msedge',
    // Set headless to false to see the browser during testing
    headless: false,
    // Slow down operations for better visibility during development
    slowMo: 500,
    // Take screenshots on failure
    screenshot: 'only-on-failure',
    // Record video on failure
    video: 'retain-on-failure',
    // Base URL for local HTML files
    baseURL: 'file://' + path.resolve(__dirname).replace(/\\/g, '/') + '/'
  },
  projects: [
    {
      name: 'Microsoft Edge',
      use: {
        browserName: 'chromium',
        channel: 'msedge',
      },
    },
  ],
});
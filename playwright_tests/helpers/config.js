/**
 * Configuration helper for Playwright tests
 * JavaScript port of python_tests/config.py
 */

const path = require('path');

class TestConfig {
  // Base paths
  static get PROJECT_ROOT() {
    return path.resolve(__dirname, '../..');
  }

  static get HTML_FILES_PATH() {
    return this.PROJECT_ROOT;
  }

  // HTML file URLs (convert to file:// URLs)
  static get ADMIN_PROTOTYPE_URL() {
    return `file://${this.HTML_FILES_PATH}/admin-prototype.html`.replace(/\\/g, '/');
  }

  static get NOTIFICATION_MANAGEMENT_URL() {
    return `file://${this.HTML_FILES_PATH}/notification-management.html`.replace(/\\/g, '/');
  }

  static get TEMPLATE_MANAGEMENT_URL() {
    return `file://${this.HTML_FILES_PATH}/template-management.html`.replace(/\\/g, '/');
  }

  static get OUTAGE_HISTORY_URL() {
    return `file://${this.HTML_FILES_PATH}/outage-history.html`.replace(/\\/g, '/');
  }

  // Browser settings (handled by Playwright config)
  static BROWSER = 'edge';
  static HEADLESS = false;
  static IMPLICIT_WAIT = 10000; // milliseconds
  static PAGE_LOAD_TIMEOUT = 30000; // milliseconds
  static SLOW_MOTION = true;
  static SLOW_MOTION_DELAY = 500; // milliseconds

  // Screenshot settings
  static TAKE_SCREENSHOTS = true;
  static SCREENSHOT_ON_FAILURE = true;
  
  static get SCREENSHOT_PATH() {
    return path.join(this.PROJECT_ROOT, 'playwright_tests', 'reports', 'screenshots');
  }

  // Report settings
  static get HTML_REPORT_PATH() {
    return path.join(this.PROJECT_ROOT, 'playwright_tests', 'reports', 'performance-comparison.html');
  }

  // Test data
  static MOCK_DATA_ENABLED = true;
}

module.exports = TestConfig;

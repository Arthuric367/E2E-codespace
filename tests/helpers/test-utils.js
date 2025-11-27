/**
 * Common test utilities and helper functions
 * Shared across all test files
 */

class TestUtils {
  
  /**
   * Wait for element to be visible with custom timeout
   */
  static async waitForVisible(element, timeout = 5000) {
    await element.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   */
  static async waitForHidden(element, timeout = 5000) {
    await element.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page, name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Generate random string for test data
   */
  static generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email for test data
   */
  static generateRandomEmail() {
    const username = this.generateRandomString(6);
    return `${username}@clp.com.hk`;
  }

  /**
   * Generate random staff ID
   */
  static generateRandomStaffId() {
    const number = Math.floor(Math.random() * 9999) + 1;
    return `EMP${number.toString().padStart(4, '0')}`;
  }

  /**
   * Wait for page to be fully loaded
   */
  static async waitForPageLoad(page, timeout = 10000) {
    await page.waitForLoadState('networkidle', { timeout });
    await page.waitForTimeout(1000); // Additional wait for UI to settle
  }

  /**
   * Clear all form inputs in a container
   */
  static async clearForm(container) {
    const inputs = await container.locator('input, select, textarea').all();
    for (const input of inputs) {
      const tagName = await input.evaluate(el => el.tagName.toLowerCase());
      if (tagName === 'input') {
        await input.fill('');
      } else if (tagName === 'select') {
        await input.selectOption('');
      } else if (tagName === 'textarea') {
        await input.fill('');
      }
    }
  }

  /**
   * Check if element has specific class
   */
  static async hasClass(element, className) {
    const classes = await element.getAttribute('class');
    return classes && classes.includes(className);
  }

  /**
   * Get text content of element, trimmed
   */
  static async getTextContent(element) {
    const text = await element.textContent();
    return text ? text.trim() : '';
  }

  /**
   * Check if table row contains specific data
   */
  static async rowContainsData(row, expectedData) {
    const cells = await row.locator('td').all();
    const rowText = await Promise.all(cells.map(cell => cell.textContent()));
    const rowString = rowText.join(' ').toLowerCase();
    
    return Object.values(expectedData).every(value => 
      rowString.includes(value.toString().toLowerCase())
    );
  }

  /**
   * Count visible elements matching selector
   */
  static async countVisibleElements(page, selector) {
    const elements = await page.locator(selector).all();
    let count = 0;
    for (const element of elements) {
      if (await element.isVisible()) {
        count++;
      }
    }
    return count;
  }

  /**
   * Verify table data matches expected structure
   */
  static async verifyTableStructure(table, expectedHeaders) {
    const headers = await table.locator('th').allTextContents();
    const cleanHeaders = headers.map(h => h.trim());
    
    for (const expectedHeader of expectedHeaders) {
      if (!cleanHeaders.some(header => header.includes(expectedHeader))) {
        throw new Error(`Expected header "${expectedHeader}" not found in table. Found: ${cleanHeaders.join(', ')}`);
      }
    }
    return true;
  }

  /**
   * Wait for success message and get its text
   */
  static async waitForSuccessMessage(page, timeout = 5000) {
    const successMessage = page.locator('.update-message, .success-message, .alert-success');
    await successMessage.waitFor({ state: 'visible', timeout });
    return await successMessage.textContent();
  }

  /**
   * Wait for error message and get its text
   */
  static async waitForErrorMessage(page, timeout = 5000) {
    const errorMessage = page.locator('.error-message, .alert-error, .alert-danger');
    await errorMessage.waitFor({ state: 'visible', timeout });
    return await errorMessage.textContent();
  }

  /**
   * Simulate file upload
   */
  static async uploadFile(fileInput, filePath, fileName = 'test.csv') {
    // Create test file content
    const fileContent = `staffID,name,email,role
TEST001,Test User 1,test1@clp.com.hk,Call Center Agent
TEST002,Test User 2,test2@clp.com.hk,Field Operations`;

    // Set files on input
    await fileInput.setInputFiles({
      name: fileName,
      mimeType: 'text/csv',
      buffer: Buffer.from(fileContent)
    });
  }

  /**
   * Verify dropdown options contain expected values
   */
  static async verifyDropdownOptions(select, expectedOptions) {
    const options = await select.locator('option').allTextContents();
    const cleanOptions = options.map(o => o.trim()).filter(o => o.length > 0);
    
    for (const expected of expectedOptions) {
      if (!cleanOptions.includes(expected)) {
        throw new Error(`Expected option "${expected}" not found. Available: ${cleanOptions.join(', ')}`);
      }
    }
    return true;
  }

  /**
   * Wait for modal to appear and be ready
   */
  static async waitForModal(modal, timeout = 5000) {
    await modal.waitFor({ state: 'visible', timeout });
    // Wait for animation to complete
    await modal.page().waitForTimeout(300);
  }

  /**
   * Wait for modal to disappear
   */
  static async waitForModalClose(modal, timeout = 5000) {
    await modal.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Verify URL contains expected path (for navigation tests)
   */
  static async verifyURL(page, expectedPath) {
    const currentURL = page.url();
    if (!currentURL.includes(expectedPath)) {
      throw new Error(`Expected URL to contain "${expectedPath}", but got "${currentURL}"`);
    }
    return true;
  }

  /**
   * Generate CSV content for testing
   */
  static generateCSVContent(data) {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const headerRow = headers.join(',');
    const dataRows = data.map(row => 
      headers.map(header => row[header] || '').join(',')
    );
    
    return [headerRow, ...dataRows].join('\n');
  }

  /**
   * Verify sorting functionality
   */
  static async verifySorting(table, columnIndex, expectedOrder = 'asc') {
    const rows = await table.locator('tbody tr').all();
    const values = [];
    
    for (const row of rows) {
      const cell = row.locator(`td:nth-child(${columnIndex + 1})`);
      const text = await cell.textContent();
      values.push(text.trim());
    }
    
    const sortedValues = [...values].sort();
    if (expectedOrder === 'desc') {
      sortedValues.reverse();
    }
    
    const isSorted = JSON.stringify(values) === JSON.stringify(sortedValues);
    if (!isSorted) {
      throw new Error(`Table is not sorted correctly. Expected: ${sortedValues.join(', ')}, Got: ${values.join(', ')}`);
    }
    
    return true;
  }

  /**
   * Log test step for debugging
   */
  static logStep(stepDescription) {
    console.log(`🔹 Test Step: ${stepDescription}`);
  }

  /**
   * Create test data cleanup function
   */
  static createCleanupFunction(page) {
    return async () => {
      try {
        // Close any open modals
        const modals = await page.locator('.modal-overlay, .role-modal-overlay, .report-overlay').all();
        for (const modal of modals) {
          if (await modal.isVisible()) {
            const closeBtn = modal.locator('.modal-close, .role-modal-close, .report-close');
            if (await closeBtn.isVisible()) {
              await closeBtn.click();
            }
          }
        }
        
        // Dismiss any success messages
        const messages = await page.locator('.update-message').all();
        for (const message of messages) {
          if (await message.isVisible()) {
            const closeBtn = message.locator('.close-btn');
            if (await closeBtn.isVisible()) {
              await closeBtn.click();
            }
          }
        }
        
        // Clear any form inputs
        const inputs = await page.locator('input:not([type="hidden"])').all();
        for (const input of inputs) {
          if (await input.isVisible()) {
            await input.fill('');
          }
        }
        
      } catch (error) {
        console.warn('Cleanup failed:', error.message);
      }
    };
  }
}

module.exports = TestUtils;
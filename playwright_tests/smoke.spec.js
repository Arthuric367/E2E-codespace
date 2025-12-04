/**
 * Smoke tests to verify the test framework is working
 * JavaScript port of python_tests/test_smoke.py
 * 
 * This is a simple test to validate the setup before running full test suite
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('Smoke Tests', () => {
  
  test('verify Node environment', async () => {
    // Check Node version
    const nodeVersion = process.version;
    console.log(`Node version: ${nodeVersion}`);
    
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    expect(majorVersion).toBeGreaterThanOrEqual(14);
  });

  test('verify required packages', async () => {
    // Verify Playwright is available
    try {
      const playwright = require('@playwright/test');
      expect(playwright).toBeDefined();
      console.log('Playwright package available');
    } catch (error) {
      throw new Error('Playwright package not installed');
    }
  });

  test('verify project files', async () => {
    // Verify required project files exist
    const projectRoot = path.resolve(__dirname, '..');
    
    const requiredFiles = [
      'admin-prototype.html',
      'package.json'
    ];
    
    for (const file of requiredFiles) {
      const filePath = path.join(projectRoot, file);
      expect(fs.existsSync(filePath)).toBeTruthy();
      console.log(`Found: ${file}`);
    }
  });

  test('verify test structure', async () => {
    // Verify test project structure
    const testDir = path.resolve(__dirname, '.');
    
    const requiredDirs = [
      'administration',
      'page-objects',
      'helpers',
      'test-data'
    ];
    
    for (const dir of requiredDirs) {
      const dirPath = path.join(testDir, dir);
      expect(fs.existsSync(dirPath)).toBeTruthy();
      console.log(`Found directory: ${dir}`);
    }
  });

  test('basic browser setup', async ({ browser }) => {
    // Test basic browser functionality
    expect(browser).toBeDefined();
    expect(browser.isConnected()).toBeTruthy();
    console.log(`Browser connected: ${browser.browserType().name()}`);
    
    // Create a page
    const page = await browser.newPage();
    expect(page).toBeDefined();
    console.log('Page created successfully');
    
    await page.close();
  });

  test('load admin prototype page', async ({ page }) => {
    // Test loading the admin prototype HTML file
    const projectRoot = path.resolve(__dirname, '..');
    const adminPagePath = path.join(projectRoot, 'admin-prototype.html');
    const fileUrl = `file://${adminPagePath}`.replace(/\\/g, '/');
    
    console.log(`Loading: ${fileUrl}`);
    await page.goto(fileUrl);
    
    // Verify page loaded
    const title = await page.title();
    expect(title).toBeTruthy();
    console.log(`Page title: ${title}`);
    
    // Verify basic page structure
    const body = await page.locator('body');
    expect(await body.count()).toBe(1);
    console.log('✅ Admin prototype page loaded successfully');
  });

  test('verify page object model', async () => {
    // Test that page object can be imported
    const AdministrationPage = require('./page-objects/administration-page');
    expect(AdministrationPage).toBeDefined();
    console.log('✅ AdministrationPage class available');
  });

  test('verify test data helper', async () => {
    // Test that test data helper can be imported
    const TestDataHelper = require('./test-data/test-data');
    expect(TestDataHelper).toBeDefined();
    
    // Test data generation
    const mockUsers = TestDataHelper.getMockUsers();
    expect(mockUsers).toBeDefined();
    expect(mockUsers.length).toBeGreaterThan(0);
    console.log(`✅ TestDataHelper working - ${mockUsers.length} mock users available`);
    
    const mockRoles = TestDataHelper.getMockRoles();
    expect(mockRoles).toBeDefined();
    expect(mockRoles.length).toBeGreaterThan(0);
    console.log(`✅ TestDataHelper working - ${mockRoles.length} mock roles available`);
  });

  test('verify config helper', async () => {
    // Test that config helper works
    const TestConfig = require('./helpers/config');
    expect(TestConfig).toBeDefined();
    
    // Test config values
    expect(TestConfig.ADMIN_PROTOTYPE_URL).toContain('admin-prototype.html');
    console.log(`✅ Config loaded - Admin URL: ${TestConfig.ADMIN_PROTOTYPE_URL}`);
  });

  test('verify performance reporter', async () => {
    // Test that performance reporter can be loaded
    const PerformanceReporter = require('./helpers/performance-reporter');
    expect(PerformanceReporter).toBeDefined();
    console.log('✅ PerformanceReporter class available');
  });
});

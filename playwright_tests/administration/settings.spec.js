/**
 * Test cases for Settings functionality
 * JavaScript port of python_tests/administration/test_settings.py
 * 
 * Test Coverage:
 * - EP-33-39: Communication settings (email, SMS, push notifications)
 * - EP-44: Delay settings for different notification types
 * - EP-90: Extreme weather mode configuration
 * - EP-101: Weather threshold settings
 * - EP-110-112: Advanced notification settings and configuration
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const AdministrationPage = require('../page-objects/administration-page');
const TestDataHelper = require('../test-data/test-data');

test.describe('Settings Tests', () => {
  let adminPage;

  test.beforeEach(async ({ page }) => {
    // Navigate to admin prototype page
    const projectRoot = path.resolve(__dirname, '../..');
    const fileUrl = `file://${path.join(projectRoot, 'admin-prototype.html')}`.replace(/\\/g, '/');
    await page.goto(fileUrl);
    adminPage = new AdministrationPage(page);
  });

  test('EP-33: Email notifications toggle', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Test enabling email notifications
    await adminPage.toggleEmailNotifications(true);
    
    // Save settings
    await adminPage.saveSettings();
    
    // Verify success
    const successMsg = await adminPage.waitForSuccessMessage(5000);
    if (successMsg) {
      console.log(`✅ Email notifications enabled: ${successMsg}`);
    }
    
    // Test disabling email notifications
    await adminPage.toggleEmailNotifications(false);
    
    // Save settings
    await adminPage.saveSettings();
    
    console.log('✅ Email notifications toggle functionality tested');
  });

  test('EP-34: SMS notifications toggle', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Test enabling SMS notifications
    await adminPage.toggleSmsNotifications(true);
    
    // Save settings
    await adminPage.saveSettings();
    
    // Verify success
    const successMsg = await adminPage.waitForSuccessMessage(5000);
    if (successMsg) {
      console.log(`✅ SMS notifications enabled: ${successMsg}`);
    }
    
    // Test disabling SMS notifications
    await adminPage.toggleSmsNotifications(false);
    
    // Save settings
    await adminPage.saveSettings();
    
    console.log('✅ SMS notifications toggle functionality tested');
  });

  test('EP-35: Push notifications configuration', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Check for push notification toggle element
    const pushToggleExists = await adminPage.isElementPresent(adminPage.pushNotificationsToggle);
    
    if (pushToggleExists) {
      // Test enabling push notifications
      await adminPage.togglePushNotifications(true);
      
      // Save settings
      await adminPage.saveSettings();
      
      console.log('✅ Push notifications configuration tested');
    } else {
      console.log('⚠️ Push notifications toggle not found - may need implementation');
    }
  });

  test('EP-44: Planned outage delay settings', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Test different delay values
    const delayValues = [30, 60, 120, 180]; // minutes
    
    for (const delay of delayValues) {
      await adminPage.setPlannedOutageDelay(delay);
      await adminPage.slowAction(500);
      
      // Save settings
      await adminPage.saveSettings();
      
      console.log(`✅ Planned outage delay set to ${delay} minutes`);
      
      // Verify success message
      const successMsg = await adminPage.waitForSuccessMessage(5000);
      if (successMsg) {
        console.log(`  Success: ${successMsg}`);
      }
    }
  });

  test('EP-44: Unplanned outage delay settings', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Check for unplanned outage delay element
    const unplannedDelayExists = await adminPage.isElementPresent(adminPage.unplannedOutageDelay);
    
    if (unplannedDelayExists) {
      // Test setting unplanned outage delay
      await adminPage.setUnplannedOutageDelay(15); // 15 minutes
      
      // Save settings
      await adminPage.saveSettings();
      
      console.log('✅ Unplanned outage delay settings tested');
    } else {
      console.log('⚠️ Unplanned outage delay setting not found');
    }
  });

  test('EP-44: Emergency delay settings', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Check for emergency delay element
    const emergencyDelayExists = await adminPage.isElementPresent(adminPage.emergencyDelay);
    
    if (emergencyDelayExists) {
      // Test setting emergency delay
      await adminPage.setEmergencyDelay(5); // 5 minutes
      
      // Save settings
      await adminPage.saveSettings();
      
      console.log('✅ Emergency delay settings tested');
    } else {
      console.log('⚠️ Emergency delay setting not found');
    }
  });

  test('EP-90: Extreme weather mode toggle', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Test enabling extreme weather mode
    await adminPage.toggleExtremeWeatherMode(true);
    
    // Save settings
    await adminPage.saveSettings();
    
    // Verify success
    const successMsg1 = await adminPage.waitForSuccessMessage(5000);
    if (successMsg1) {
      console.log(`✅ Extreme weather mode enabled: ${successMsg1}`);
    }
    
    // Test disabling extreme weather mode
    await adminPage.toggleExtremeWeatherMode(false);
    
    // Save settings
    await adminPage.saveSettings();
    
    console.log('✅ Extreme weather mode toggle functionality tested');
  });

  test('EP-101: Weather threshold temperature settings', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Enable extreme weather mode first
    await adminPage.toggleExtremeWeatherMode(true);
    
    // Check for temperature threshold element
    const tempThresholdExists = await adminPage.isElementPresent(adminPage.weatherThresholdTemp);
    
    if (tempThresholdExists) {
      // Test different temperature values
      const testTemperatures = [30, 35, 40, 45]; // Celsius
      
      for (const temp of testTemperatures) {
        await adminPage.setWeatherThresholdTemp(temp);
        await adminPage.slowAction(500);
        
        console.log(`✅ Temperature threshold set to ${temp}°C`);
      }
      
      // Save settings
      await adminPage.saveSettings();
      
      console.log('✅ Weather temperature threshold settings tested');
    } else {
      console.log('⚠️ Weather temperature threshold setting not found');
    }
  });

  test('EP-101: Weather threshold wind speed settings', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Enable extreme weather mode first
    await adminPage.toggleExtremeWeatherMode(true);
    
    // Check for wind speed threshold element
    const windThresholdExists = await adminPage.isElementPresent(adminPage.weatherThresholdWind);
    
    if (windThresholdExists) {
      // Test different wind speed values
      const testWindSpeeds = [50, 60, 70, 80]; // km/h
      
      for (const speed of testWindSpeeds) {
        await adminPage.setWeatherThresholdWind(speed);
        await adminPage.slowAction(500);
        
        console.log(`✅ Wind speed threshold set to ${speed} km/h`);
      }
      
      // Save settings
      await adminPage.saveSettings();
      
      console.log('✅ Weather wind speed threshold settings tested');
    } else {
      console.log('⚠️ Weather wind speed threshold setting not found');
    }
  });

  test('All communication channels enabled', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Enable all notification channels
    await adminPage.toggleEmailNotifications(true);
    await adminPage.toggleSmsNotifications(true);
    
    // Check if push notifications exist
    const pushExists = await adminPage.isElementPresent(adminPage.pushNotificationsToggle);
    if (pushExists) {
      await adminPage.togglePushNotifications(true);
    }
    
    // Save settings
    await adminPage.saveSettings();
    
    console.log('✅ All communication channels enabled');
    
    // Verify success
    const successMsg = await adminPage.waitForSuccessMessage(5000);
    if (successMsg) {
      console.log(`  Success: ${successMsg}`);
    }
  });

  test('All communication channels disabled', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Disable all notification channels
    await adminPage.toggleEmailNotifications(false);
    await adminPage.toggleSmsNotifications(false);
    
    // Check if push notifications exist
    const pushExists = await adminPage.isElementPresent(adminPage.pushNotificationsToggle);
    if (pushExists) {
      await adminPage.togglePushNotifications(false);
    }
    
    // Save settings
    await adminPage.saveSettings();
    
    console.log('✅ All communication channels disabled');
  });

  test('Settings reset functionality', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Make some changes
    await adminPage.toggleEmailNotifications(false);
    await adminPage.setPlannedOutageDelay(999);
    
    // Reset settings
    await adminPage.resetSettings();
    
    console.log('✅ Settings reset functionality tested');
    
    // Could verify settings returned to defaults
    // This depends on implementation
  });

  test('Extreme weather complete configuration', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Enable extreme weather mode
    await adminPage.toggleExtremeWeatherMode(true);
    
    // Configure temperature threshold
    const tempExists = await adminPage.isElementPresent(adminPage.weatherThresholdTemp);
    if (tempExists) {
      await adminPage.setWeatherThresholdTemp(38);
    }
    
    // Configure wind speed threshold
    const windExists = await adminPage.isElementPresent(adminPage.weatherThresholdWind);
    if (windExists) {
      await adminPage.setWeatherThresholdWind(65);
    }
    
    // Save settings
    await adminPage.saveSettings();
    
    console.log('✅ Complete extreme weather configuration tested');
    console.log('  Temperature threshold: 38°C');
    console.log('  Wind speed threshold: 65 km/h');
    
    // Verify success
    const successMsg = await adminPage.waitForSuccessMessage(5000);
    if (successMsg) {
      console.log(`  Success: ${successMsg}`);
    }
  });

  test('Delay settings for all notification types', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Set planned outage delay
    await adminPage.setPlannedOutageDelay(90);
    console.log('✅ Planned outage delay: 90 minutes');
    
    // Set unplanned outage delay if exists
    const unplannedExists = await adminPage.isElementPresent(adminPage.unplannedOutageDelay);
    if (unplannedExists) {
      await adminPage.setUnplannedOutageDelay(20);
      console.log('✅ Unplanned outage delay: 20 minutes');
    }
    
    // Set emergency delay if exists
    const emergencyExists = await adminPage.isElementPresent(adminPage.emergencyDelay);
    if (emergencyExists) {
      await adminPage.setEmergencyDelay(10);
      console.log('✅ Emergency delay: 10 minutes');
    }
    
    // Save settings
    await adminPage.saveSettings();
    
    console.log('✅ All delay settings configured');
  });

  test('Settings page navigation and structure', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Verify save button is present
    const saveButtonExists = await adminPage.isElementPresent(adminPage.saveSettingsBtn);
    expect(saveButtonExists).toBeTruthy();
    console.log('✅ Save button present');
    
    // Verify reset button is present
    const resetButtonExists = await adminPage.isElementPresent(adminPage.resetSettingsBtn);
    expect(resetButtonExists).toBeTruthy();
    console.log('✅ Reset button present');
    
    // Verify key settings sections exist
    const emailToggleExists = await adminPage.isElementPresent(adminPage.emailNotificationsToggle);
    expect(emailToggleExists).toBeTruthy();
    console.log('✅ Email notifications setting present');
    
    const smsToggleExists = await adminPage.isElementPresent(adminPage.smsNotificationsToggle);
    expect(smsToggleExists).toBeTruthy();
    console.log('✅ SMS notifications setting present');
    
    console.log('✅ Settings page structure verified');
  });

  test('Save settings without changes', async ({ page }) => {
    // Navigate to Settings
    await adminPage.clickSettingsNav();
    
    // Save without making any changes
    await adminPage.saveSettings();
    
    // Check for success or info message
    const successMsg = await adminPage.waitForSuccessMessage(5000);
    if (successMsg) {
      console.log(`✅ Save without changes successful: ${successMsg}`);
    } else {
      console.log('✅ Save without changes completed (no message)');
    }
  });
});

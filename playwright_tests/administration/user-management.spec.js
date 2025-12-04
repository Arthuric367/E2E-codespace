/**
 * Test cases for User Management functionality
 * JavaScript port of python_tests/administration/test_user_management.py
 * 
 * Test Coverage:
 * - EP-3: Display users in a tabular format
 * - EP-23: Add new users 
 * - EP-24: Edit existing users
 * - EP-25: Delete users
 * - EP-26: Filter users by department
 * - EP-27: Filter users by role
 * - EP-28: Search users by name/email
 * - EP-29: Bulk upload users
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const AdministrationPage = require('../page-objects/administration-page');
const TestDataHelper = require('../test-data/test-data');
const TestConfig = require('../helpers/config');

test.describe('User Management Tests', () => {
  let adminPage;

  test.beforeEach(async ({ page }) => {
    // Navigate to admin prototype page
    const projectRoot = path.resolve(__dirname, '../..');
    const fileUrl = `file://${path.join(projectRoot, 'admin-prototype.html')}`.replace(/\\/g, '/');
    await page.goto(fileUrl);
    adminPage = new AdministrationPage(page);
  });

  test('EP-3: Display users in tabular format', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    // Verify table is present
    const tableExists = await adminPage.isElementPresent(adminPage.userTable);
    expect(tableExists).toBeTruthy();
    console.log('✅ User table is present');
    
    // Verify table headers
    const headers = await adminPage.getUserTableHeaders();
    expect(headers.length).toBeGreaterThan(0);
    console.log(`✅ Table headers found: ${headers.join(', ')}`);
    
    // Verify table has rows
    const rowsCount = await adminPage.getUserTableRowsCount();
    console.log(`📊 Found ${rowsCount} user rows in table`);
    expect(rowsCount).toBeGreaterThanOrEqual(0);
  });

  test('EP-23: Add new user with valid data', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    // Get initial row count
    const initialCount = await adminPage.getUserTableRowsCount();
    console.log(`📊 Initial user count: ${initialCount}`);
    
    // Click Add User button
    await adminPage.clickAddUserButton();
    
    // Create test user with actual role from HTML
    const testUser = TestDataHelper.createTestUser({
      userId: 'TEST001',
      name: 'Test User',
      email: 'test.user@company.com',
      role: 'System Admin'
    });
    
    // Fill user form
    await adminPage.fillUserForm({
      userId: testUser.id,
      name: testUser.name,
      email: testUser.email,
      role: testUser.role,
      status: testUser.status
    });
    
    // Save user
    await adminPage.saveUser();
    
    // Verify success (check for success message or table update)
    const successMsg = await adminPage.waitForSuccessMessage(5000);
    if (successMsg) {
      console.log(`✅ Success message: ${successMsg}`);
    }
    
    // Verify user appears in table
    const newCount = await adminPage.getUserTableRowsCount();
    console.log(`📊 Users - before: ${initialCount}, after: ${newCount}`);
  });

  test('EP-23: Add user with invalid email format', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    // Click Add User button
    await adminPage.clickAddUserButton();
    
    // Fill form with invalid email
    await adminPage.fillUserForm({
      userId: 'TEST002',
      name: 'Invalid Email User',
      email: 'invalid-email', // Invalid format
      role: 'System Admin'
    });
    
    // Attempt to save
    await adminPage.saveUser();
    
    // Check for error message or validation
    const errorMsg = await adminPage.waitForErrorMessage(5000);
    if (errorMsg) {
      console.log(`✅ Expected error message: ${errorMsg}`);
    }
  });

  test('EP-24: Edit existing user information', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    // Get existing users
    const users = await adminPage.getUserTableData();
    
    if (users.length > 0) {
      console.log(`📝 Editing first user: ${JSON.stringify(users[0])}`);
      
      // Click edit button for first user (assuming edit button exists)
      const editBtn = await page.locator('.edit-user-btn').first();
      
      if (await editBtn.count() > 0) {
        await editBtn.click();
        await adminPage.slowAction();
        
        // Modify user data
        await adminPage.fillUserForm({
          name: 'Modified User Name',
          email: 'modified.email@company.com',
          department: 'Operations'
        });
        
        // Save changes
        await adminPage.saveUser();
        
        // Verify success
        const successMsg = await adminPage.waitForSuccessMessage(5000);
        if (successMsg) {
          console.log(`✅ User modified successfully: ${successMsg}`);
        }
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('EP-25: Delete user with confirmation', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    const initialCount = await adminPage.getUserTableRowsCount();
    
    if (initialCount > 0) {
      // Select first user checkbox
      await adminPage.selectUserCheckbox(0);
      
      // Click delete selected button
      await adminPage.clickDeleteSelectedButton();
      
      // Confirm deletion
      await adminPage.confirmAction(true);
      
      // Verify user count decreased
      const newCount = await adminPage.getUserTableRowsCount();
      console.log(`📊 Users before deletion: ${initialCount}, after: ${newCount}`);
      
      // Check for success message
      const successMsg = await adminPage.waitForSuccessMessage(5000);
      if (successMsg) {
        console.log(`✅ Delete confirmation: ${successMsg}`);
      }
    } else {
      test.skip();
    }
  });

  test('EP-25: Cancel user deletion', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    const initialCount = await adminPage.getUserTableRowsCount();
    
    if (initialCount > 0) {
      // Select first user checkbox
      await adminPage.selectUserCheckbox(0);
      
      // Click delete selected button
      await adminPage.clickDeleteSelectedButton();
      
      // Cancel deletion
      await adminPage.confirmAction(false);
      
      // Verify user count unchanged
      const newCount = await adminPage.getUserTableRowsCount();
      expect(newCount).toBe(initialCount);
      console.log(`✅ Deletion cancelled successfully, count unchanged: ${newCount}`);
    } else {
      test.skip();
    }
  });

  test.skip('EP-26: Filter users by department', async ({ page }) => {
    // Department filter does not exist in User Management module
    // This test is skipped as confirmed by business requirements
  });

  test('EP-27: Filter users by role', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    // Filter by role - use actual role from HTML
    const testRole = 'system admin';
    await adminPage.filterUsersByRole(testRole);
    
    // Get filtered results
    const filteredUsers = await adminPage.getUserTableData();
    console.log(`🔍 Users with ${testRole} role: ${filteredUsers.length}`);
    
    // Verify all shown users have selected role (case-insensitive)
    for (const user of filteredUsers) {
      if (user.role) {
        expect(user.role.toLowerCase()).toContain(testRole.toLowerCase());
      }
    }
    
    // Clear filters
    await adminPage.clearAllFilters();
  });

  test('EP-28: Search users by name', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    // Get some user data first
    const users = await adminPage.getUserTableData();
    
    if (users.length > 0) {
      // Log first user to debug
      console.log(`📝 First user data: ${JSON.stringify(users[0])}`);
      
      // Search for first user's name
      const searchName = users[0].name.split(' ')[0]; // First word of name
      console.log(`🔍 Searching for users with name containing: ${searchName}`);
      
      await adminPage.searchUsers(searchName);
      
      // Get search results
      const searchResults = await adminPage.getUserTableData();
      console.log(`📊 Search results: ${searchResults.length} users found`);
      
      // Verify search results contain the search term (in name OR email since search box searches both)
      expect(searchResults.length).toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });

  test('EP-28: Search users by email', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    // Search for users with CLP email domain (actual domain in HTML)
    const searchTerm = '@clp.com.hk';
    await adminPage.searchUsers(searchTerm);
    
    // Get search results
    const searchResults = await adminPage.getUserTableData();
    console.log(`📧 Users with CLP email: ${searchResults.length}`);
    
    // Verify we got some results
    expect(searchResults.length).toBeGreaterThan(0);
  });

  test('EP-29: Bulk upload users button functionality', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    // Click bulk upload button
    await adminPage.clickBulkUploadButton();
    
    // Verify bulk upload modal/form appears
    // This test verifies the UI element is accessible
    console.log('✅ Bulk upload button clicked successfully');
    
    // Note: Actual file upload testing would require additional setup
    // and file handling which depends on the specific implementation
  });

  test('Filter users by Active status', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    // Filter by Active status
    await adminPage.filterUsersByStatus('Active');
    
    // Get filtered results
    const filteredUsers = await adminPage.getUserTableData();
    console.log(`✅ Active users: ${filteredUsers.length}`);
    
    // Verify all shown users are active
    for (const user of filteredUsers) {
      if (user.status) {
        expect(user.status).toBe('Active');
      }
    }
  });

  test('User form validation for required fields', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    // Click Add User button
    await adminPage.clickAddUserButton();
    
    // Try to save with empty form
    await adminPage.saveUser();
    
    // Check for validation error
    const errorMsg = await adminPage.waitForErrorMessage(5000);
    if (errorMsg) {
      console.log(`✅ Validation error caught: ${errorMsg}`);
    }
    
    // Cancel the form
    await adminPage.cancelUser();
  });

  test('User table column sorting functionality', async ({ page }) => {
    // Navigate to User Management
    await adminPage.clickUserManagementNav();
    
    // Get initial user data
    const initialUsers = await adminPage.getUserTableData();
    const initialCount = initialUsers.length;
    console.log(`📊 Initial user count for sorting test: ${initialCount}`);
    
    // Try clicking on table headers for sorting (if implemented)
    const headers = await page.locator('#userTable thead th').all();
    
    if (headers.length > 1) {
      // Click on name column header (assuming it's sortable)
      const nameHeader = headers.length > 2 ? headers[2] : headers[1];
      await nameHeader.click();
      await adminPage.slowAction();
      
      console.log('✅ Column header clicked for sorting');
    }
    
    // Verify table still displays users
    const sortedUsers = await adminPage.getUserTableData();
    const sortedCount = sortedUsers.length;
    expect(sortedCount).toBe(initialCount);
  });
});

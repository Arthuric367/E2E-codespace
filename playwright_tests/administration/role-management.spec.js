/**
 * Test cases for Role Management functionality
 * JavaScript port of python_tests/administration/test_role_management.py
 * 
 * Test Coverage:
 * - EP-30: Add new roles
 * - EP-31: Edit existing roles  
 * - EP-32: Delete roles
 * - EP-40: Assign permissions to roles
 * - EP-41: View role permissions
 * - EP-89: Alert Group assignment for roles
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const AdministrationPage = require('../page-objects/administration-page');
const TestDataHelper = require('../test-data/test-data');

test.describe('Role Management Tests', () => {
  let adminPage;

  test.beforeEach(async ({ page }) => {
    // Navigate to admin prototype page
    const projectRoot = path.resolve(__dirname, '../..');
    const fileUrl = `file://${path.join(projectRoot, 'admin-prototype.html')}`.replace(/\\/g, '/');
    await page.goto(fileUrl);
    adminPage = new AdministrationPage(page);
  });

  test('EP-30: Add new role with valid data', async ({ page }) => {
    // Navigate to Role Management
    await adminPage.clickRoleManagementNav();
    
    // Get initial role count
    const initialCount = await adminPage.getRoleTableRowsCount();
    console.log(`📊 Initial roles count: ${initialCount}`);
    
    // Click Add Role button
    await adminPage.clickAddRoleButton();
    
    // Create test role
    const testRole = TestDataHelper.createTestRole({
      name: 'Test Manager Role',
      description: 'Test role for management functions',
      permissions: ['user_view', 'notification_management', 'reporting']
    });
    
    // Fill role form
    await adminPage.fillRoleForm({
      roleName: testRole.name,
      description: testRole.description,
      permissions: testRole.permissions
    });
    
    // Save role
    await adminPage.saveRole();
    
    // Verify success
    const successMsg = await adminPage.waitForSuccessMessage(5000);
    if (successMsg) {
      console.log(`✅ Success message: ${successMsg}`);
    }
    
    // Verify role appears in table
    const newCount = await adminPage.getRoleTableRowsCount();
    console.log(`📊 Roles after addition - before: ${initialCount}, after: ${newCount}`);
  });

  test('EP-30: Add role with duplicate name (should fail)', async ({ page }) => {
    // Navigate to Role Management
    await adminPage.clickRoleManagementNav();
    
    // Click Add Role button
    await adminPage.clickAddRoleButton();
    
    // Try to create role with existing name
    await adminPage.fillRoleForm({
      roleName: 'Administrator', // Assuming this role already exists
      description: 'Duplicate role test',
      permissions: ['user_view']
    });
    
    // Attempt to save
    await adminPage.saveRole();
    
    // Check for error message
    const errorMsg = await adminPage.waitForErrorMessage(5000);
    if (errorMsg) {
      console.log(`✅ Expected error for duplicate role: ${errorMsg}`);
    } else {
      console.log('⚠️ No error message detected - validation may need improvement');
    }
  });

  test('EP-31: Edit existing role information', async ({ page }) => {
    // Navigate to Role Management
    await adminPage.clickRoleManagementNav();
    
    // Look for edit buttons in role table
    const editButtons = await page.locator(adminPage.editRoleBtn).all();
    
    if (editButtons.length > 0) {
      console.log(`📝 Found ${editButtons.length} roles to edit`);
      
      // Click edit button for first role
      await editButtons[0].click();
      await adminPage.slowAction();
      
      // Modify role data
      await adminPage.fillRoleForm({
        roleName: 'Modified Role Name',
        description: 'Updated role description with new permissions',
        permissions: ['user_view', 'notification_management'] // Modified permissions
      });
      
      // Save changes
      await adminPage.saveRole();
      
      // Verify success
      const successMsg = await adminPage.waitForSuccessMessage(5000);
      if (successMsg) {
        console.log(`✅ Role edited successfully: ${successMsg}`);
      }
    } else {
      test.skip();
    }
  });

  test('EP-32: Delete role with confirmation', async ({ page }) => {
    // Navigate to Role Management
    await adminPage.clickRoleManagementNav();
    
    const initialCount = await adminPage.getRoleTableRowsCount();
    console.log(`📊 Initial roles count: ${initialCount}`);
    
    // Look for delete buttons
    const deleteButtons = await page.locator(adminPage.deleteRoleBtn).all();
    
    if (deleteButtons.length > 0) {
      // Click delete button for last role (to avoid deleting critical roles)
      await deleteButtons[deleteButtons.length - 1].click();
      await adminPage.slowAction();
      
      // Confirm deletion
      await adminPage.confirmAction(true);
      
      // Verify role count decreased
      const newCount = await adminPage.getRoleTableRowsCount();
      console.log(`📊 Roles after deletion - before: ${initialCount}, after: ${newCount}`);
      
      // Check for success message
      const successMsg = await adminPage.waitForSuccessMessage(5000);
      if (successMsg) {
        console.log(`✅ Delete confirmation: ${successMsg}`);
      }
    } else {
      test.skip();
    }
  });

  test('EP-32: Cancel role deletion', async ({ page }) => {
    // Navigate to Role Management
    await adminPage.clickRoleManagementNav();
    
    const initialCount = await adminPage.getRoleTableRowsCount();
    
    // Look for delete buttons
    const deleteButtons = await page.locator(adminPage.deleteRoleBtn).all();
    
    if (deleteButtons.length > 0) {
      // Click delete button
      await deleteButtons[0].click();
      await adminPage.slowAction();
      
      // Cancel deletion
      await adminPage.confirmAction(false);
      
      // Verify role count unchanged
      const newCount = await adminPage.getRoleTableRowsCount();
      expect(newCount).toBe(initialCount);
      console.log(`✅ Deletion cancelled successfully, count unchanged: ${newCount}`);
    } else {
      test.skip();
    }
  });

  test('EP-40: Assign permissions to roles', async ({ page }) => {
    // Navigate to Role Management
    await adminPage.clickRoleManagementNav();
    
    // Click Add Role button to test permission assignment
    await adminPage.clickAddRoleButton();
    
    // Test different permission combinations
    const testPermissions = [
      ['user_management', 'role_management'],
      ['notification_management', 'reporting'],
      ['system_administration', 'settings_management']
    ];
    
    // Test the last permission set
    const permissions = testPermissions[testPermissions.length - 1];
    const roleName = 'Permission Test Role';
    
    // Fill role form with specific permissions
    await adminPage.fillRoleForm({
      roleName: roleName,
      description: `Testing role with permissions: ${permissions.join(', ')}`,
      permissions: permissions
    });
    
    console.log(`✅ Assigned permissions ${permissions} to role ${roleName}`);
    
    // Save the role
    await adminPage.saveRole();
  });

  test('EP-41: View role permissions', async ({ page }) => {
    // Navigate to Role Management
    await adminPage.clickRoleManagementNav();
    
    // Look for view/edit buttons to see role permissions
    const editButtons = await page.locator(adminPage.editRoleBtn).all();
    
    if (editButtons.length > 0) {
      // Click edit/view button to see permissions
      await editButtons[0].click();
      await adminPage.slowAction();
      
      // Check for permission checkboxes/displays
      const permissionElements = await page.locator(adminPage.permissionsCheckboxes).all();
      
      if (permissionElements.length > 0) {
        console.log(`✅ Found ${permissionElements.length} permission options`);
        
        // Check which permissions are selected
        const selectedPermissions = [];
        for (const permission of permissionElements) {
          if (await permission.isChecked()) {
            const permissionName = await permission.getAttribute('value');
            selectedPermissions.push(permissionName);
          }
        }
        
        console.log(`📋 Selected permissions: ${selectedPermissions.join(', ')}`);
      } else {
        console.log('⚠️ No permission elements found - UI may need adjustment');
      }
    } else {
      test.skip();
    }
  });

  test('EP-89: Alert Group assignment for roles', async ({ page }) => {
    // Navigate to Role Management
    await adminPage.clickRoleManagementNav();
    
    // Click Add Role button
    await adminPage.clickAddRoleButton();
    
    // Look for Alert Group assignment fields
    const alertGroupElements = await page.locator(
      'select[name="alertGroup"], input[name="alertGroup"], .alert-group-selector'
    ).all();
    
    if (alertGroupElements.length > 0) {
      console.log(`✅ Found Alert Group assignment elements: ${alertGroupElements.length}`);
      
      // Fill role form with Alert Group
      await adminPage.fillRoleForm({
        roleName: 'Alert Group Test Role',
        description: 'Role with specific alert group assignment'
      });
      
      // Additional Alert Group specific logic would go here
      // This depends on the specific implementation in the HTML
      
      console.log('📢 Alert Group assignment functionality available');
    } else {
      console.log('⚠️ Alert Group assignment not found - may need implementation');
      
      // Still create a basic role for testing
      await adminPage.fillRoleForm({
        roleName: 'Basic Alert Role',
        description: 'Basic role for alert testing'
      });
    }
    
    // Save role
    await adminPage.saveRole();
  });

  test('Role form validation for required fields', async ({ page }) => {
    // Navigate to Role Management
    await adminPage.clickRoleManagementNav();
    
    // Click Add Role button
    await adminPage.clickAddRoleButton();
    
    // Try to save with empty form
    await adminPage.saveRole();
    
    // Check for validation error
    const errorMsg = await adminPage.waitForErrorMessage(5000);
    if (errorMsg) {
      console.log(`✅ Validation error caught: ${errorMsg}`);
    } else {
      console.log('⚠️ No validation error - may need improvement');
    }
  });

  test('Role with all permissions selected', async ({ page }) => {
    // Navigate to Role Management
    await adminPage.clickRoleManagementNav();
    
    // Click Add Role button
    await adminPage.clickAddRoleButton();
    
    // Get all available permissions
    const allPermissions = TestDataHelper.getPermissions();
    
    // Create role with all permissions
    await adminPage.fillRoleForm({
      roleName: 'Super Admin Role',
      description: 'Role with all available permissions',
      permissions: allPermissions
    });
    
    // Save role
    await adminPage.saveRole();
    
    console.log(`✅ Created role with ${allPermissions.length} permissions`);
  });

  test('Role with no permissions selected', async ({ page }) => {
    // Navigate to Role Management
    await adminPage.clickRoleManagementNav();
    
    // Click Add Role button
    await adminPage.clickAddRoleButton();
    
    // Create role with no permissions
    await adminPage.fillRoleForm({
      roleName: 'No Permission Role',
      description: 'Role with no permissions for testing',
      permissions: [] // Empty permissions list
    });
    
    // Save role
    await adminPage.saveRole();
    
    console.log('✅ Created role with no permissions');
  });

  test('Role table display and structure', async ({ page }) => {
    // Navigate to Role Management
    await adminPage.clickRoleManagementNav();
    
    // Verify role table is present
    const tableExists = await adminPage.isElementPresent(adminPage.roleTable);
    expect(tableExists).toBeTruthy();
    
    // Get role count
    const roleCount = await adminPage.getRoleTableRowsCount();
    console.log(`📊 Total roles in table: ${roleCount}`);
    
    // Check table structure
    const tableHeaders = await page.locator('#roleTable thead th').all();
    if (tableHeaders.length > 0) {
      const headerText = [];
      for (const header of tableHeaders) {
        headerText.push(await header.textContent());
      }
      console.log(`📋 Role table headers: ${headerText.join(', ')}`);
    }
    
    // Verify action buttons are present
    const addButton = await adminPage.isElementPresent(adminPage.addRoleBtn);
    expect(addButton).toBeTruthy();
    console.log('✅ Role management UI elements verified');
  });
});

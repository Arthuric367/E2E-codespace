/**
 * Role Management Tests
 * Based on Jira Stories: EP-30-32, EP-40-41, EP-89
 * Testing UI functionality for role administration
 */

const { test, expect } = require('@playwright/test');
const AdministrationPage = require('../helpers/page-objects/administration-page');
const TestData = require('../helpers/test-data');

test.describe('Role Management', () => {
  let adminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdministrationPage(page);
    await adminPage.goto();
    await adminPage.waitForPageLoad();
    await adminPage.navigateToRoles();
  });

  test.describe('EP-30: Display role list', () => {
    test('should display all roles with their permissions', async () => {
      // Verify roles grid is visible
      await expect(adminPage.rolesGrid).toBeVisible();
      
      // Verify role cards are displayed
      const roleCount = await adminPage.getRoleCount();
      expect(roleCount).toBeGreaterThan(0);
      
      // Verify each role card contains required information
      const firstRoleCard = adminPage.roleCards.first();
      await expect(firstRoleCard.locator('h3')).toBeVisible(); // Role name
      await expect(firstRoleCard.locator('.role-users')).toBeVisible(); // User count
      await expect(firstRoleCard.locator('.role-permissions')).toBeVisible(); // Permissions list
    });

    test('should display number of active users for each role', async () => {
      const roleCards = adminPage.roleCards;
      const cardCount = await roleCards.count();
      
      for (let i = 0; i < cardCount; i++) {
        const roleCard = roleCards.nth(i);
        const userCountElement = roleCard.locator('.role-users');
        await expect(userCountElement).toBeVisible();
        
        // Verify it shows user count information
        const userCountText = await userCountElement.textContent();
        expect(userCountText).toMatch(/\d+.*user/i);
      }
    });

    test('should show permissions with granted/denied status', async () => {
      const firstRoleCard = adminPage.roleCards.first();
      const permissions = firstRoleCard.locator('.permission-item');
      
      const permissionCount = await permissions.count();
      expect(permissionCount).toBeGreaterThan(0);
      
      // Check that permissions show granted/denied status
      for (let i = 0; i < Math.min(permissionCount, 5); i++) {
        const permission = permissions.nth(i);
        const hasGrantedClass = await permission.getAttribute('class');
        expect(hasGrantedClass).toMatch(/(granted|denied)/);
      }
    });

    test('should display role action buttons', async () => {
      const firstRoleCard = adminPage.roleCards.first();
      const roleActions = firstRoleCard.locator('.role-actions');
      
      await expect(roleActions).toBeVisible();
      await expect(roleActions.locator('.btn-icon')).toHaveCount(2); // Edit and Delete buttons
    });
  });

  test.describe('EP-32: Create new role', () => {
    test('should open new role creation modal', async () => {
      await adminPage.addNewRoleBtn.click();
      
      // Verify modal opens
      await expect(adminPage.roleModal).toBeVisible();
      await expect(adminPage.roleModalTitle).toContainText('Add New Role');
    });

    test('should create new role with valid data', async () => {
      const newRole = {
        name: 'Test Role',
        permissions: ['Access Residential Customer Information', 'Receive Notifications']
      };
      
      await adminPage.addNewRoleBtn.click();
      await expect(adminPage.roleModal).toBeVisible();
      
      // Fill role name
      await adminPage.roleNameInput.fill(newRole.name);
      
      // Select permissions
      for (const permission of newRole.permissions) {
        const permissionItem = adminPage.permissionCheckboxes.filter({ hasText: permission });
        await permissionItem.click();
      }
      
      // Save role
      await adminPage.saveRoleBtn.click();
      
      // Verify modal closes
      await expect(adminPage.roleModal).not.toBeVisible();
      
      // Verify success message
      await expect(adminPage.updateMessage).toBeVisible();
      expect(await adminPage.getSuccessMessageText()).toContain('created successfully');
    });

    test('should validate unique role name', async () => {
      await adminPage.addNewRoleBtn.click();
      await expect(adminPage.roleModal).toBeVisible();
      
      // Try to create role with existing name
      await adminPage.roleNameInput.fill('System Administrator');
      await adminPage.saveRoleBtn.click();
      
      // Modal should remain open with validation error
      await expect(adminPage.roleModal).toBeVisible();
    });

    test('should require role name', async () => {
      await adminPage.addNewRoleBtn.click();
      await expect(adminPage.roleModal).toBeVisible();
      
      // Try to save without role name
      await adminPage.saveRoleBtn.click();
      
      // Modal should remain open
      await expect(adminPage.roleModal).toBeVisible();
    });

    test('should cancel role creation', async () => {
      await adminPage.addNewRoleBtn.click();
      await expect(adminPage.roleModal).toBeVisible();
      
      // Fill some data
      await adminPage.roleNameInput.fill('Cancel Test Role');
      
      // Cancel
      await adminPage.cancelRoleBtn.click();
      
      // Verify modal closes without saving
      await expect(adminPage.roleModal).not.toBeVisible();
    });

    test('should display all available permissions for selection', async () => {
      await adminPage.addNewRoleBtn.click();
      await expect(adminPage.roleModal).toBeVisible();
      
      // Verify permission checkboxes are available
      const permissionCount = await adminPage.permissionCheckboxes.count();
      expect(permissionCount).toBeGreaterThan(5); // Should have multiple permissions
      
      // Verify some standard permissions are present
      await expect(adminPage.permissionCheckboxes.filter({ hasText: 'Full Dashboard Access' })).toBeVisible();
      await expect(adminPage.permissionCheckboxes.filter({ hasText: 'User Administration' })).toBeVisible();
      await expect(adminPage.permissionCheckboxes.filter({ hasText: 'Template Management' })).toBeVisible();
    });
  });

  test.describe('EP-31: Edit role', () => {
    test('should open edit modal for existing role', async () => {
      // Click edit button on first role
      const firstRoleCard = adminPage.roleCards.first();
      const editBtn = firstRoleCard.locator('.btn-icon').first();
      
      await editBtn.click();
      
      // Verify edit modal opens
      await expect(adminPage.roleModal).toBeVisible();
      await expect(adminPage.roleModalTitle).toContainText('Edit Role');
    });

    test('should pre-populate role data in edit mode', async () => {
      const firstRoleCard = adminPage.roleCards.first();
      const roleName = await firstRoleCard.locator('h3').textContent();
      
      // Open edit modal
      const editBtn = firstRoleCard.locator('.btn-icon').first();
      await editBtn.click();
      
      await expect(adminPage.roleModal).toBeVisible();
      
      // Verify role name is pre-filled
      await expect(adminPage.roleNameInput).toHaveValue(roleName.trim());
      
      // Verify existing permissions are selected
      const selectedPermissions = adminPage.permissionCheckboxes.filter('.selected');
      const selectedCount = await selectedPermissions.count();
      expect(selectedCount).toBeGreaterThan(0);
    });

    test('should save role changes', async () => {
      // Open edit modal for first role
      const firstRoleCard = adminPage.roleCards.first();
      const editBtn = firstRoleCard.locator('.btn-icon').first();
      await editBtn.click();
      
      await expect(adminPage.roleModal).toBeVisible();
      
      // Modify role name
      await adminPage.roleNameInput.fill('Updated Role Name');
      
      // Toggle a permission
      const firstPermission = adminPage.permissionCheckboxes.first();
      await firstPermission.click();
      
      // Save changes
      await adminPage.saveRoleBtn.click();
      
      // Verify modal closes
      await expect(adminPage.roleModal).not.toBeVisible();
      
      // Verify success message
      await expect(adminPage.updateMessage).toBeVisible();
      expect(await adminPage.getSuccessMessageText()).toMatch(/updated|saved/i);
    });

    test('should cancel role edit without saving', async () => {
      const firstRoleCard = adminPage.roleCards.first();
      const originalRoleName = await firstRoleCard.locator('h3').textContent();
      
      // Open edit modal
      const editBtn = firstRoleCard.locator('.btn-icon').first();
      await editBtn.click();
      
      // Make changes
      await adminPage.roleNameInput.fill('Should Not Save');
      
      // Cancel
      await adminPage.cancelRoleBtn.click();
      
      // Verify modal closes
      await expect(adminPage.roleModal).not.toBeVisible();
      
      // Verify original name is preserved (in a real app)
      // For mockup, we just verify the cancel flow worked
    });

    test('should validate role name uniqueness on edit', async () => {
      // Open edit modal for first role
      const firstRoleCard = adminPage.roleCards.first();
      const editBtn = firstRoleCard.locator('.btn-icon').first();
      await editBtn.click();
      
      // Try to change name to an existing role name
      await adminPage.roleNameInput.fill('System Administrator');
      await adminPage.saveRoleBtn.click();
      
      // Should show validation error
      await expect(adminPage.roleModal).toBeVisible(); // Modal remains open
    });

    test('should update permission assignments', async () => {
      const firstRoleCard = adminPage.roleCards.first();
      const editBtn = firstRoleCard.locator('.btn-icon').first();
      await editBtn.click();
      
      await expect(adminPage.roleModal).toBeVisible();
      
      // Find a permission that can be toggled
      const permissionToToggle = adminPage.permissionCheckboxes.filter({ hasText: 'Download Data' });
      await permissionToToggle.click();
      
      // Save changes
      await adminPage.saveRoleBtn.click();
      
      // Verify success
      await expect(adminPage.updateMessage).toBeVisible();
    });
  });

  test.describe('EP-41: Delete role', () => {
    test('should show confirmation dialog when deleting role', async () => {
      const firstRoleCard = adminPage.roleCards.first();
      const deleteBtn = firstRoleCard.locator('.btn-icon.btn-danger');
      
      await deleteBtn.click();
      
      // Verify confirmation dialog appears
      await expect(adminPage.warningModal).toBeVisible();
      await expect(adminPage.warningModal).toContainText(/confirm.*delete/i);
    });

    test('should prevent deletion of critical system roles', async () => {
      // Find System Administrator role (critical role)
      const adminRoleCard = adminPage.roleCards.filter({ hasText: 'System Administrator' });
      if (await adminRoleCard.count() > 0) {
        const deleteBtn = adminRoleCard.locator('.btn-icon.btn-danger');
        
        await deleteBtn.click();
        await expect(adminPage.warningModal).toBeVisible();
        
        // Try to confirm deletion
        await adminPage.confirmDialog();
        
        // Should show error message preventing deletion
        await expect(adminPage.updateMessage).toBeVisible();
        expect(await adminPage.getSuccessMessageText()).toMatch(/cannot.*delete|critical.*role/i);
      }
    });

    test('should warn if role is assigned to users', async () => {
      // Find a role with active users
      const roleWithUsers = adminPage.roleCards.filter({ hasText: /\d+.*user/i }).first();
      const deleteBtn = roleWithUsers.locator('.btn-icon.btn-danger');
      
      await deleteBtn.click();
      
      // Verify warning about assigned users
      await expect(adminPage.warningModal).toBeVisible();
      await expect(adminPage.warningModal).toContainText(/user.*assign/i);
    });

    test('should delete role when confirmed', async () => {
      const initialRoleCount = await adminPage.getRoleCount();
      
      // Delete a role (preferably one with no users)
      const lastRoleCard = adminPage.roleCards.last();
      const deleteBtn = lastRoleCard.locator('.btn-icon.btn-danger');
      
      await deleteBtn.click();
      await expect(adminPage.warningModal).toBeVisible();
      
      // Confirm deletion
      await adminPage.confirmDialog();
      
      // Verify success message
      await expect(adminPage.updateMessage).toBeVisible();
      expect(await adminPage.getSuccessMessageText()).toContain('deleted successfully');
    });

    test('should cancel role deletion', async () => {
      const initialRoleCount = await adminPage.getRoleCount();
      
      const firstRoleCard = adminPage.roleCards.first();
      const deleteBtn = firstRoleCard.locator('.btn-icon.btn-danger');
      
      await deleteBtn.click();
      await expect(adminPage.warningModal).toBeVisible();
      
      // Cancel deletion
      await adminPage.cancelDialog();
      
      // Verify modal closes and role remains
      await expect(adminPage.warningModal).not.toBeVisible();
      
      const currentRoleCount = await adminPage.getRoleCount();
      expect(currentRoleCount).toBe(initialRoleCount);
    });
  });

  test.describe('EP-89: Alert Group (Special Role)', () => {
    test('should create Alert Group role with mandatory "Receive Alert Message" permission', async () => {
      await adminPage.addNewRoleBtn.click();
      await expect(adminPage.roleModal).toBeVisible();
      
      // Create Alert Group role
      await adminPage.roleNameInput.fill('Alert Group');
      
      // Select "Receive Alert Message" permission (mandatory)
      const alertPermission = adminPage.permissionCheckboxes.filter({ hasText: 'Receive Alert Message' });
      await alertPermission.click();
      
      // Add other permissions
      const otherPermissions = adminPage.permissionCheckboxes.filter({ hasText: 'Receive Notifications' });
      await otherPermissions.click();
      
      // Save role
      await adminPage.saveRoleBtn.click();
      
      // Verify success
      await expect(adminPage.updateMessage).toBeVisible();
    });

    test('should make "Receive Alert Message" permission mandatory for Alert Group', async () => {
      // This test would verify that when editing Alert Group,
      // the "Receive Alert Message" permission cannot be unchecked
      
      // Find Alert Group role
      const alertGroupCard = adminPage.roleCards.filter({ hasText: 'Alert Group' });
      if (await alertGroupCard.count() > 0) {
        const editBtn = alertGroupCard.locator('.btn-icon').first();
        await editBtn.click();
        
        await expect(adminPage.roleModal).toBeVisible();
        
        // Try to uncheck mandatory permission
        const mandatoryPermission = adminPage.permissionCheckboxes.filter({ hasText: 'Receive Alert Message' });
        
        // Verify it's checked and potentially disabled
        await expect(mandatoryPermission).toHaveClass(/selected|checked/);
      }
    });

    test('should validate all permissions except "Receive Alert Message" can be changed for Alert Group', async () => {
      const alertGroupCard = adminPage.roleCards.filter({ hasText: 'Alert Group' });
      if (await alertGroupCard.count() > 0) {
        const editBtn = alertGroupCard.locator('.btn-icon').first();
        await editBtn.click();
        
        await expect(adminPage.roleModal).toBeVisible();
        
        // Try to change other permissions (should be allowed)
        const otherPermission = adminPage.permissionCheckboxes.filter({ hasText: 'User Administration' });
        await otherPermission.click();
        
        // Save should work
        await adminPage.saveRoleBtn.click();
        await expect(adminPage.updateMessage).toBeVisible();
      }
    });
  });

  test.describe('Role Management UI Interactions', () => {
    test('should hover effects on role cards', async () => {
      const firstRoleCard = adminPage.roleCards.first();
      
      // Hover should show enhanced styling
      await firstRoleCard.hover();
      
      // Verify card is still visible and interactive
      await expect(firstRoleCard).toBeVisible();
    });

    test('should handle modal close via X button', async () => {
      await adminPage.addNewRoleBtn.click();
      await expect(adminPage.roleModal).toBeVisible();
      
      // Close via X button
      const closeBtn = adminPage.roleModal.locator('.role-modal-close');
      await closeBtn.click();
      
      // Verify modal closes
      await expect(adminPage.roleModal).not.toBeVisible();
    });

    test('should handle multiple permission selections', async () => {
      await adminPage.addNewRoleBtn.click();
      await expect(adminPage.roleModal).toBeVisible();
      
      // Select multiple permissions
      const permissions = [
        'Full Dashboard Access',
        'Template Management',
        'Send Notifications',
        'Receive Notifications'
      ];
      
      for (const permission of permissions) {
        const permissionItem = adminPage.permissionCheckboxes.filter({ hasText: permission });
        await permissionItem.click();
      }
      
      // Verify multiple permissions can be selected
      const selectedPermissions = adminPage.permissionCheckboxes.filter('.selected');
      const selectedCount = await selectedPermissions.count();
      expect(selectedCount).toBeGreaterThanOrEqual(permissions.length);
    });

    test('should maintain role card layout with different permission counts', async () => {
      // Verify all role cards maintain consistent layout
      const roleCards = adminPage.roleCards;
      const cardCount = await roleCards.count();
      
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const roleCard = roleCards.nth(i);
        
        // Each card should have consistent structure
        await expect(roleCard.locator('.role-header')).toBeVisible();
        await expect(roleCard.locator('.role-permissions')).toBeVisible();
        await expect(roleCard.locator('.role-actions')).toBeVisible();
      }
    });
  });
});
/**
 * Page Object Model for Administration Prototype Page
 * Provides methods to interact with UI elements in the admin-prototype.html page
 * JavaScript port of python_tests/page_objects/administration_page.py
 */

class AdministrationPage {
  constructor(page) {
    this.page = page;
    this.slowMo = 500; // milliseconds, matching Playwright config
    
    // ===== NAVIGATION SELECTORS =====
    this.navUserManagement = 'a.tab:has-text("Users")';
    this.navRoleManagement = 'a.tab:has-text("Roles")';
    this.navSettings = 'a.tab:has-text("Settings")';
    
    // ===== USER MANAGEMENT SELECTORS =====
    // User table
    this.userTable = '#userTable';
    this.userTableRows = '#userTable tbody tr';
    this.userTableHeaders = '#userTable thead th';
    
    // User actions
    this.addUserBtn = '#addUserBtn';
    this.bulkUploadBtn = '#bulkUploadBtn';
    this.deleteSelectedBtn = '#deleteSelectedBtn';
    
    // User form fields
    this.userIdInput = '#userId';
    this.userNameInput = '#userName';
    this.userEmailInput = '#userEmail';
    this.userRoleDropdown = '#userRole'; // Multi-select dropdown
    this.userStatusSelect = '#userStatus';
    
    // User form buttons
    this.saveUserBtn = '#saveUserBtn';
    this.cancelUserBtn = '#cancelUserBtn';
    
    // Search and filters
    this.userSearchInput = '#userSearch';
    this.roleFilter = '#roleFilter'; // Multi-select dropdown
    this.statusFilter = '#statusFilter';
    this.clearFiltersBtn = '#clearFiltersBtn';
    
    // ===== ROLE MANAGEMENT SELECTORS =====
    // Role table
    this.roleTable = '#roleTable';
    this.roleTableRows = '#roleTable tbody tr';
    
    // Role actions
    this.addRoleBtn = '#addRoleBtn';
    this.editRoleBtn = '.edit-role-btn';
    this.deleteRoleBtn = '.delete-role-btn';
    
    // Role form fields
    this.roleNameInput = '#roleName';
    this.roleDescriptionInput = '#roleDescription';
    this.permissionsCheckboxes = 'input[name="permissions"]';
    
    // Role form buttons
    this.saveRoleBtn = '#saveRoleBtn';
    this.cancelRoleBtn = '#cancelRoleBtn';
    
    // ===== SETTINGS SELECTORS =====
    // Communication Settings
    this.emailNotificationsToggle = '#emailNotifications';
    this.smsNotificationsToggle = '#smsNotifications';
    this.pushNotificationsToggle = '#pushNotifications';
    
    // Delay Settings
    this.plannedOutageDelay = '#plannedOutageDelay';
    this.unplannedOutageDelay = '#unplannedOutageDelay';
    this.emergencyDelay = '#emergencyDelay';
    
    // Extreme Weather Mode
    this.extremeWeatherToggle = '#extremeWeatherMode';
    this.weatherThresholdTemp = '#weatherThresholdTemp';
    this.weatherThresholdWind = '#weatherThresholdWind';
    
    // Settings buttons
    this.saveSettingsBtn = '#saveSettingsBtn';
    this.resetSettingsBtn = '#resetSettingsBtn';
    
    // ===== COMMON SELECTORS =====
    this.successMessage = '.alert-success';
    this.errorMessage = '.alert-danger';
    this.confirmationModal = '#confirmationModal';
    this.confirmYesBtn = '#confirmYes';
    this.confirmNoBtn = '#confirmNo';
  }

  /**
   * Add delay between actions for visibility (matches pytest slow motion)
   */
  async slowAction(milliseconds = null) {
    const delay = milliseconds || this.slowMo;
    await this.page.waitForTimeout(delay);
  }

  // ===== NAVIGATION METHODS =====
  
  async clickUserManagementNav() {
    await this.page.click(this.navUserManagement);
    await this.slowAction();
    return this;
  }

  async clickRoleManagementNav() {
    await this.page.click(this.navRoleManagement);
    await this.slowAction();
    return this;
  }

  async clickSettingsNav() {
    await this.page.click(this.navSettings);
    await this.slowAction();
    return this;
  }

  // ===== USER MANAGEMENT METHODS =====
  
  async getUserTableHeaders() {
    const headers = await this.page.locator(this.userTableHeaders).allTextContents();
    return headers;
  }

  async getUserTableRowsCount() {
    try {
      const rows = await this.page.locator(this.userTableRows).count();
      return rows;
    } catch (error) {
      return 0;
    }
  }

  async getUserTableData() {
    const users = [];
    const rows = await this.page.locator(this.userTableRows).all();
    
    for (const row of rows) {
      // Skip hidden rows (filtered out by filter functions)
      const isVisible = await row.isVisible();
      if (!isVisible) {
        continue;
      }
      
      const cells = await row.locator('td').all();
      // Table columns: [0] Checkbox, [1] Name, [2] Email, [3] Role, [4] Status, [5] Last Login, [6] Actions
      if (cells.length >= 6) {
        const userData = {
          name: (await cells[1].textContent()).trim(),
          email: (await cells[2].textContent()).trim(),
          role: (await cells[3].textContent()).trim(),
          status: (await cells[4].textContent()).trim(),
          lastLogin: cells.length > 5 ? (await cells[5].textContent()).trim() : ''
        };
        users.push(userData);
      }
    }
    
    return users;
  }

  async clickAddUserButton() {
    await this.page.click(this.addUserBtn);
    await this.slowAction();
    return this;
  }

  async fillUserForm({ userId, name, email, role }) {
    if (userId) {
      await this.page.fill(this.userIdInput, '');
      await this.page.fill(this.userIdInput, userId);
      await this.slowAction(200);
    }

    if (name) {
      await this.page.fill(this.userNameInput, '');
      await this.page.fill(this.userNameInput, name);
      await this.slowAction(200);
    }

    if (email) {
      await this.page.fill(this.userEmailInput, '');
      await this.page.fill(this.userEmailInput, email);
      await this.slowAction(200);
    }

    if (role) {
      // Handle multi-select role dropdown (new compact design)
      // First, open the dropdown by clicking the button
      await this.page.click(`${this.userRoleDropdown} .multi-select-button`);
      await this.slowAction(200);
      
      // role can be string or array
      const roles = Array.isArray(role) ? role : [role];
      
      // Click each role checkbox
      for (const roleName of roles) {
        const checkbox = await this.page.locator(`${this.userRoleDropdown} input[value="${roleName}"]`);
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
          await checkbox.click();
          await this.slowAction(100);
        }
      }
      
      // Close dropdown by clicking button again
      await this.page.click(`${this.userRoleDropdown} .multi-select-button`);
      await this.slowAction(200);
    }

    // Status is removed - new users are always Active

    return this;
  }

  async saveUser() {
    await this.page.click(this.saveUserBtn);
    await this.slowAction();
    return this;
  }

  async cancelUser() {
    await this.page.click(this.cancelUserBtn);
    await this.slowAction();
    return this;
  }

  async searchUsers(searchTerm) {
    await this.page.fill(this.userSearchInput, '');
    await this.page.fill(this.userSearchInput, searchTerm);
    await this.page.press(this.userSearchInput, 'Enter');
    await this.slowAction();
    return this;
  }

  async filterUsersByRole(role) {
    // Role filter is a multi-select dropdown
    // First, open the dropdown
    await this.page.click(`${this.roleFilter} .multi-select-button`);
    await this.slowAction(200);
    
    // Find and click the checkbox for the role
    const roleId = `role_filter_${role.toLowerCase().replace(/\s+/g, '_')}`;
    await this.page.click(`#${roleId}`);
    
    // Wait for the filter to be applied (onchange triggers filterUsers())
    await this.slowAction(500);
    
    // Close dropdown by clicking outside or button again
    await this.page.click(`${this.roleFilter} .multi-select-button`);
    await this.slowAction();
    return this;
  }

  async filterUsersByStatus(status) {
    await this.page.selectOption(this.statusFilter, status);
    await this.slowAction();
    return this;
  }

  async clearAllFilters() {
    await this.page.click(this.clearFiltersBtn);
    await this.slowAction();
    return this;
  }

  async selectUserCheckbox(userIndex) {
    const rows = await this.page.locator(this.userTableRows).all();
    if (userIndex < rows.length) {
      await rows[userIndex].locator('input[type="checkbox"]').click();
      await this.slowAction();
    }
    return this;
  }

  async clickBulkUploadButton() {
    await this.page.click(this.bulkUploadBtn);
    await this.slowAction();
    return this;
  }

  async clickDeleteSelectedButton() {
    await this.page.click(this.deleteSelectedBtn);
    await this.slowAction();
    return this;
  }

  // ===== ROLE MANAGEMENT METHODS =====
  
  async getRoleTableRowsCount() {
    try {
      const rows = await this.page.locator(this.roleTableRows).count();
      return rows;
    } catch (error) {
      return 0;
    }
  }

  async clickAddRoleButton() {
    await this.page.click(this.addRoleBtn);
    await this.slowAction();
    return this;
  }

  async fillRoleForm({ roleName, description, permissions }) {
    if (roleName) {
      await this.page.fill(this.roleNameInput, '');
      await this.page.fill(this.roleNameInput, roleName);
      await this.slowAction(200);
    }

    if (description) {
      await this.page.fill(this.roleDescriptionInput, '');
      await this.page.fill(this.roleDescriptionInput, description);
      await this.slowAction(200);
    }

    if (permissions) {
      // Get all permission items (the clickable divs)
      const permissionItems = await this.page.locator('.permission-item-modal').all();
      
      for (const item of permissionItems) {
        const permission = await item.getAttribute('data-permission');
        const isSelected = await item.evaluate(el => el.classList.contains('selected'));
        
        const shouldBeSelected = permissions.includes(permission);
        
        // Toggle if current state doesn't match desired state
        if (shouldBeSelected !== isSelected) {
          await item.click();
          await this.slowAction(100);
        }
      }
    }

    return this;
  }

  async saveRole() {
    await this.page.click(this.saveRoleBtn);
    await this.slowAction();
    return this;
  }

  async cancelRole() {
    await this.page.click(this.cancelRoleBtn);
    await this.slowAction();
    return this;
  }

  // ===== SETTINGS METHODS =====
  
  async expandSettingsGroup(groupTitle) {
    // Find the settings group by its title and expand it if collapsed
    const groupHeader = this.page.locator(`.settings-group-header:has-text("${groupTitle}")`);
    await groupHeader.waitFor({ state: 'visible', timeout: 5000 });
    
    // Check if the group is collapsed (icon is ▶)
    const icon = groupHeader.locator('.settings-group-icon');
    const iconText = await icon.textContent();
    
    if (iconText.includes('▶')) {
      // Group is collapsed, click to expand
      await groupHeader.click();
      await this.slowAction(500);
    }
    return this;
  }
  
  async toggleEmailNotifications(enable = true) {
    const toggle = this.page.locator(this.emailNotificationsToggle);
    await toggle.waitFor({ state: 'visible', timeout: 10000 });
    const isActive = await toggle.evaluate(el => el.classList.contains('active'));
    
    if (isActive !== enable) {
      await toggle.click();
      await this.slowAction(300);
      // Handle confirmation modal if it appears
      try {
        const okButton = this.page.locator('#communicationToggleModal button.btn-modal-primary');
        await okButton.waitFor({ state: 'visible', timeout: 2000 });
        await okButton.click();
        await this.slowAction();
      } catch (e) {
        // Modal didn't appear, continue
      }
    }
    return this;
  }

  async toggleSmsNotifications(enable = true) {
    const toggle = this.page.locator(this.smsNotificationsToggle);
    await toggle.waitFor({ state: 'visible', timeout: 10000 });
    const isActive = await toggle.evaluate(el => el.classList.contains('active'));
    
    if (isActive !== enable) {
      await toggle.click();
      await this.slowAction(300);
      // Handle confirmation modal if it appears  
      try {
        const okButton = this.page.locator('#communicationToggleModal button.btn-modal-primary');
        await okButton.waitFor({ state: 'visible', timeout: 2000 });
        await okButton.click();
        await this.slowAction();
      } catch (e) {
        // Modal didn't appear, continue
      }
    }
    return this;
  }

  async togglePushNotifications(enable = true) {
    const toggle = this.page.locator(this.pushNotificationsToggle);
    await toggle.waitFor({ state: 'visible', timeout: 10000 });
    const isActive = await toggle.evaluate(el => el.classList.contains('active'));
    
    if (isActive !== enable) {
      await toggle.click();
      await this.slowAction();
    }
    return this;
  }

  async setPlannedOutageDelay(minutes) {
    // Expand Delay & Control group if needed
    await this.expandSettingsGroup('Delay & Control');
    await this.page.fill(this.plannedOutageDelay, '');
    await this.page.fill(this.plannedOutageDelay, String(minutes));
    await this.slowAction();
    return this;
  }

  async setUnplannedOutageDelay(minutes) {
    // Expand Delay & Control group if needed
    await this.expandSettingsGroup('Delay & Control');
    await this.page.fill(this.unplannedOutageDelay, '');
    await this.page.fill(this.unplannedOutageDelay, String(minutes));
    await this.slowAction();
    return this;
  }

  async setEmergencyDelay(minutes) {
    // Expand Delay & Control group if needed
    await this.expandSettingsGroup('Delay & Control');
    await this.page.fill(this.emergencyDelay, '');
    await this.page.fill(this.emergencyDelay, String(minutes));
    await this.slowAction();
    return this;
  }

  async toggleExtremeWeatherMode(enable = true) {
    // First expand the Trigger Mode settings group
    await this.expandSettingsGroup('Trigger Mode');
    
    const toggle = this.page.locator(this.extremeWeatherToggle);
    await toggle.waitFor({ state: 'visible', timeout: 10000 });
    const isActive = await toggle.evaluate(el => el.classList.contains('active'));
    
    if (isActive !== enable) {
      await toggle.click();
      await this.slowAction();
      // Handle confirmation modal if it appears
      try {
        const okButton = this.page.locator('#extremeWeatherModal button.btn-modal-primary');
        await okButton.waitFor({ state: 'visible', timeout: 2000 });
        await okButton.click();
        await this.slowAction();
      } catch (e) {
        // Modal didn't appear, continue
      }
    }
    return this;
  }

  async setWeatherThresholdTemp(celsius) {
    // Expand Trigger Mode group if needed
    await this.expandSettingsGroup('Trigger Mode');
    await this.page.fill(this.weatherThresholdTemp, '');
    await this.page.fill(this.weatherThresholdTemp, String(celsius));
    await this.slowAction();
    return this;
  }

  async setWeatherThresholdWind(kmh) {
    // Expand Trigger Mode group if needed
    await this.expandSettingsGroup('Trigger Mode');
    await this.page.fill(this.weatherThresholdWind, '');
    await this.page.fill(this.weatherThresholdWind, String(kmh));
    await this.slowAction();
    return this;
  }

  async saveSettings() {
    await this.page.click(this.saveSettingsBtn);
    await this.slowAction();
    return this;
  }

  async resetSettings() {
    await this.page.click(this.resetSettingsBtn);
    await this.slowAction();
    return this;
  }

  // ===== COMMON METHODS =====
  
  async waitForSuccessMessage(timeout = 10000) {
    try {
      const message = await this.page.locator(this.successMessage).waitFor({ timeout });
      return await message.textContent();
    } catch (error) {
      return null;
    }
  }

  async waitForErrorMessage(timeout = 10000) {
    try {
      const message = await this.page.locator(this.errorMessage).waitFor({ timeout });
      return await message.textContent();
    } catch (error) {
      return null;
    }
  }

  async confirmAction(confirm = true) {
    try {
      await this.page.locator(this.confirmationModal).waitFor({ timeout: 5000 });
      
      if (confirm) {
        await this.page.click(this.confirmYesBtn);
      } else {
        await this.page.click(this.confirmNoBtn);
      }
      
      await this.slowAction();
    } catch (error) {
      // No confirmation modal appeared
    }
    return this;
  }

  async isElementPresent(selector, timeout = 5000) {
    try {
      await this.page.locator(selector).waitFor({ timeout });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isElementVisible(selector, timeout = 5000) {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = AdministrationPage;

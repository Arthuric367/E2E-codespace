/**
 * Page Object for Administration Module
 * Based on admin-prototype.html structure
 */

class AdministrationPage {
  constructor(page) {
    this.page = page;
    
    // Header elements
    this.menuIcon = page.locator('.menu-icon');
    this.platformTitle = page.locator('.platform-title');
    this.userAvatar = page.locator('.user-avatar');
    
    // Sidebar navigation
    this.sidebarOverlay = page.locator('.sidebar-overlay');
    this.sidebar = page.locator('.sidebar');
    this.navLinks = page.locator('.nav-link');
    this.administrationNavLink = page.locator('.nav-link').filter({ hasText: 'Administration' });
    
    // Tab navigation
    this.tabNavigation = page.locator('.tab-navigation');
    this.usersTab = page.locator('.tab').filter({ hasText: 'Users' });
    this.rolesTab = page.locator('.tab').filter({ hasText: 'Roles' });
    this.settingsTab = page.locator('.tab').filter({ hasText: 'Settings' });
    
    // Users section elements
    this.addNewUserBtn = page.locator('text="+ Add New User"');
    this.filterByRole = page.locator('select').first();
    this.filterByStatus = page.locator('select').nth(1);
    this.searchBox = page.locator('.search-box');
    this.userTable = page.locator('.user-table table');
    this.userTableRows = page.locator('.user-table tbody tr');
    
    // User action buttons
    this.editButtons = page.locator('.edit-btn');
    this.deleteButtons = page.locator('.delete-btn');
    this.disableEnableButtons = page.locator('.action-btn').filter({ hasText: /Disable|Enable/ });
    
    // User modal elements
    this.userModal = page.locator('.modal-overlay');
    this.modalStaffId = page.locator('#modal-staff-id');
    this.modalName = page.locator('#modal-name');
    this.modalEmail = page.locator('#modal-email');
    this.modalRole = page.locator('#modal-role');
    this.modalCreateBtn = page.locator('.btn-modal-primary');
    this.modalCancelBtn = page.locator('.btn-modal-secondary');
    this.modalCloseBtn = page.locator('.modal-close');
    
    // Roles section elements
    this.addNewRoleBtn = page.locator('text="+ Add New Role"');
    this.rolesGrid = page.locator('.roles-grid');
    this.roleCards = page.locator('.role-card');
    
    // Role modal elements
    this.roleModal = page.locator('.role-modal-overlay');
    this.roleModalTitle = page.locator('.role-modal-title');
    this.roleNameInput = page.locator('#role-name');
    this.permissionCheckboxes = page.locator('.permission-item-modal');
    this.saveRoleBtn = page.locator('.btn-modal-primary');
    this.cancelRoleBtn = page.locator('.btn-modal-secondary');
    
    // Settings section elements
    this.settingsContent = page.locator('.settings-content');
    this.communicationToggles = page.locator('.toggle-switch');
    this.delayInputs = page.locator('input[type="number"]');
    this.saveSettingsBtn = page.locator('.btn-form-save');
    
    // Success/Error messages
    this.updateMessage = page.locator('.update-message');
    this.warningModal = page.locator('.modal-overlay');
  }

  // Navigation methods
  async goto() {
    await this.page.goto('admin-prototype.html');
    await this.page.waitForLoadState('networkidle');
  }

  async openSidebar() {
    await this.menuIcon.click();
    await this.sidebar.waitFor({ state: 'visible' });
  }

  async closeSidebar() {
    if (await this.sidebarOverlay.isVisible()) {
      await this.sidebarOverlay.click();
    }
  }

  async navigateToUsers() {
    await this.usersTab.click();
    await this.page.waitForTimeout(500);
  }

  async navigateToRoles() {
    await this.rolesTab.click();
    await this.page.waitForTimeout(500);
  }

  async navigateToSettings() {
    await this.settingsTab.click();
    await this.page.waitForTimeout(500);
  }

  // User management methods
  async addNewUser(userData) {
    await this.addNewUserBtn.click();
    await this.userModal.waitFor({ state: 'visible' });
    
    await this.modalStaffId.fill(userData.staffID);
    await this.modalName.fill(userData.name);
    await this.modalEmail.fill(userData.email);
    await this.modalRole.selectOption(userData.role);
    
    await this.modalCreateBtn.click();
  }

  async searchUser(searchTerm) {
    await this.searchBox.fill(searchTerm);
    await this.page.waitForTimeout(500);
  }

  async filterUsersByRole(role) {
    await this.filterByRole.selectOption(role);
    await this.page.waitForTimeout(500);
  }

  async filterUsersByStatus(status) {
    await this.filterByStatus.selectOption(status);
    await this.page.waitForTimeout(500);
  }

  async editUser(userIndex) {
    await this.editButtons.nth(userIndex).click();
    await this.page.waitForTimeout(500);
  }

  async deleteUser(userIndex) {
    await this.deleteButtons.nth(userIndex).click();
    await this.warningModal.waitFor({ state: 'visible' });
  }

  async toggleUserStatus(userIndex) {
    await this.disableEnableButtons.nth(userIndex).click();
  }

  // Role management methods
  async addNewRole(roleData) {
    await this.addNewRoleBtn.click();
    await this.roleModal.waitFor({ state: 'visible' });
    
    await this.roleNameInput.fill(roleData.name);
    
    // Select permissions
    for (const permission of roleData.permissions) {
      const permissionItem = this.permissionCheckboxes.filter({ hasText: permission });
      await permissionItem.click();
    }
    
    await this.saveRoleBtn.click();
  }

  async editRole(roleIndex) {
    const editButton = this.roleCards.nth(roleIndex).locator('.btn-icon').first();
    await editButton.click();
    await this.roleModal.waitFor({ state: 'visible' });
  }

  async deleteRole(roleIndex) {
    const deleteButton = this.roleCards.nth(roleIndex).locator('.btn-icon.btn-danger');
    await deleteButton.click();
    await this.warningModal.waitFor({ state: 'visible' });
  }

  // Settings methods
  async toggleCommunication(toggleIndex) {
    await this.communicationToggles.nth(toggleIndex).click();
  }

  async setDelayValue(inputIndex, value) {
    await this.delayInputs.nth(inputIndex).fill(value.toString());
  }

  async saveSettings() {
    await this.saveSettingsBtn.click();
  }

  // Verification methods
  async getUserCount() {
    await this.userTableRows.first().waitFor({ state: 'visible', timeout: 5000 });
    return await this.userTableRows.count();
  }

  async getRoleCount() {
    await this.roleCards.first().waitFor({ state: 'visible', timeout: 5000 });
    return await this.roleCards.count();
  }

  async isUserVisible(userName) {
    const userRow = this.userTableRows.filter({ hasText: userName });
    return await userRow.isVisible();
  }

  async isRoleVisible(roleName) {
    const roleCard = this.roleCards.filter({ hasText: roleName });
    return await roleCard.isVisible();
  }

  async isSuccessMessageVisible() {
    return await this.updateMessage.isVisible();
  }

  async getSuccessMessageText() {
    return await this.updateMessage.textContent();
  }

  // Helper methods
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async dismissSuccessMessage() {
    if (await this.updateMessage.isVisible()) {
      await this.updateMessage.locator('.close-btn').click();
    }
  }

  async confirmDialog() {
    const confirmBtn = this.warningModal.locator('.btn-modal-danger');
    await confirmBtn.click();
  }

  async cancelDialog() {
    const cancelBtn = this.warningModal.locator('.btn-modal-secondary');
    await cancelBtn.click();
  }
}

module.exports = AdministrationPage;
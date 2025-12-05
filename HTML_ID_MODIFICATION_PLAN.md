# HTML ID Modification Plan for admin-prototype.html

## Overview
This document outlines all the ID attributes that need to be added to `admin-prototype.html` to make it compatible with the Playwright test suite. The tests expect specific element IDs that are currently missing from the HTML.

**Total Required Changes:** ~50 ID additions across 4 main sections

---

## 1. NAVIGATION SECTION

### Current State (Line ~2459-2467)
```html
<!-- Tab Navigation -->
<nav class="tab-navigation">
    <div class="tab-list">
        <a href="#" class="tab active">Users</a>
        <a href="#" class="tab">Customer</a>
        <a href="#" class="tab">Roles</a>
        <a href="#" class="tab">Settings</a>
    </div>
</nav>
```

### Required Changes
```html
<!-- Tab Navigation -->
<nav class="tab-navigation">
    <div class="tab-list">
        <a href="#" id="nav-users" class="tab active">Users</a>
        <a href="#" id="nav-customer" class="tab">Customer</a>
        <a href="#" id="nav-roles" class="tab">Roles</a>
        <a href="#" id="nav-settings" class="tab">Settings</a>
    </div>
</nav>
```

**IDs to Add:**
- `id="nav-users"` - Users tab navigation
- `id="nav-customer"` - Customer tab navigation
- `id="nav-roles"` - Roles tab navigation
- `id="nav-settings"` - Settings tab navigation

---

## 2. USER MANAGEMENT SECTION

### 2.1 User Action Buttons

#### Current State (Line ~2474-2481)
```html
<div class="action-buttons">
    <button class="primary-btn" onclick="showAddUserModal()">+ Add User</button>
    <button class="secondary-btn" onclick="deleteSelectedUsers()">Delete Selected</button>
    <button class="upload-btn" id="uploadBtn" onclick="showBulkUploadModal()">Upload</button>
</div>
```

#### Required Changes
```html
<div class="action-buttons">
    <button id="addUserBtn" class="primary-btn" onclick="showAddUserModal()">+ Add User</button>
    <button id="deleteSelectedBtn" class="secondary-btn" onclick="deleteSelectedUsers()">Delete Selected</button>
    <button id="bulkUploadBtn" class="upload-btn" onclick="showBulkUploadModal()">Upload</button>
</div>
```

**IDs to Add:**
- `id="addUserBtn"` - Add user button
- `id="deleteSelectedBtn"` - Delete selected users button
- `id="bulkUploadBtn"` - Bulk upload button (replace existing `id="uploadBtn"`)

### 2.2 User Table

#### Current State (Line ~2485-2487)
```html
<!-- User Table -->
<div class="user-table">
    <table>
        <thead>
```

#### Required Changes
```html
<!-- User Table -->
<div class="user-table">
    <table id="userTable">
        <thead>
```

**IDs to Add:**
- `id="userTable"` - Main user table element

### 2.3 User Search and Filters

**Need to locate and add IDs to:**
- Search input field → `id="userSearch"`
- Department filter dropdown → `id="departmentFilter"`
- Role filter dropdown → `id="roleFilter"`
- Status filter dropdown → `id="statusFilter"`
- Location filter dropdown → `id="locationFilter"`
- Clear filters button → `id="clearFiltersBtn"`

### 2.4 Add User Modal Form Fields

**Current IDs that exist (to verify):**
- `id="addUserModal"` ✓ (already exists)
- `id="addUserForm"` ✓ (already exists)
- `id="userName"` ✓ (already exists)
- `id="userEmail"` ✓ (already exists)

**IDs to Add/Verify in the modal:**
- `id="userId"` - User ID input field
- `id="userDepartment"` - Department dropdown
- `id="userRole"` - Role dropdown (may exist as `addUserRoleDropdown`)
- `id="userStatus"` - Status dropdown
- `id="userLocation"` - Location dropdown
- `id="saveUserBtn"` - Save button in user modal
- `id="cancelUserBtn"` - Cancel button in user modal

---

## 3. ROLE MANAGEMENT SECTION

### 3.1 Role Action Buttons

**Need to locate and add:**
- Add role button → `id="addRoleBtn"`

### 3.2 Role Table

**Need to locate and add:**
- Main role table → `id="roleTable"`

### 3.3 Role Modal Form Fields

**IDs to Add:**
- `id="roleName"` - Role name input
- `id="roleDescription"` - Role description textarea
- `id="saveRoleBtn"` - Save button in role modal
- `id="cancelRoleBtn"` - Cancel button in role modal

### 3.4 Permission Checkboxes

**Ensure all permission checkboxes have:**
- `name="permissions"` attribute (for selector `input[name="permissions"]`)
- Individual IDs for specific permissions if needed

---

## 4. SETTINGS SECTION

### 4.1 Communication Toggles

**Need to locate toggle switches and add:**
- Email notifications toggle → `id="emailNotifications"`
- SMS notifications toggle → `id="smsNotifications"`
- Push notifications toggle → `id="pushNotifications"`

### 4.2 Delay Settings

**Need to locate input fields and add:**
- Planned outage delay → `id="plannedOutageDelay"`
- Unplanned outage delay → `id="unplannedOutageDelay"`
- Emergency delay → `id="emergencyDelay"`

### 4.3 Extreme Weather Settings

**Current State (to verify):**
- `id="extremeWeatherModal"` ✓ (already exists)

**IDs to Add:**
- Extreme weather mode toggle → `id="extremeWeatherMode"`
- Temperature threshold input → `id="weatherThresholdTemp"`
- Wind speed threshold input → `id="weatherThresholdWind"`

### 4.4 Settings Buttons

**Need to locate and add:**
- Save settings button → `id="saveSettingsBtn"`
- Reset settings button → `id="resetSettingsBtn"`

---

## 5. COMMON ELEMENTS

### 5.1 Confirmation Modal

**IDs to Add:**
- Confirmation modal → `id="confirmationModal"`
- Confirm Yes button → `id="confirmYes"`
- Confirm No button → `id="confirmNo"`

### 5.2 Alert Messages

**Verify CSS classes exist:**
- Success alerts → `.alert-success`
- Error alerts → `.alert-danger`

---

## 6. CUSTOMER SECTION (Optional)

**Current IDs that exist:**
- `id="customerSection"` ✓
- `id="customerAccount"` ✓
- `id="customerSearch"` ✓

These appear to be already in place for customer management features.

---

## Implementation Checklist

### Phase 1: Critical Elements (Required for tests to run)
- [ ] Add navigation tab IDs (nav-users, nav-roles, nav-settings)
- [ ] Add user table ID (userTable)
- [ ] Add user action button IDs (addUserBtn, deleteSelectedBtn, bulkUploadBtn)
- [ ] Add role table ID (roleTable)
- [ ] Add role action button ID (addRoleBtn)

### Phase 2: Form Elements
- [ ] Verify and add all user form field IDs
- [ ] Verify and add all role form field IDs
- [ ] Add user/role modal button IDs (save/cancel)

### Phase 3: Settings Elements
- [ ] Add communication toggle IDs
- [ ] Add delay setting input IDs
- [ ] Add weather setting IDs
- [ ] Add settings button IDs

### Phase 4: Secondary Elements
- [ ] Add search and filter IDs
- [ ] Add confirmation modal IDs
- [ ] Verify alert message classes

---

## Validation Steps

After making changes:

1. **HTML Validation**
   ```bash
   # Check for duplicate IDs
   grep -o 'id="[^"]*"' admin-prototype.html | sort | uniq -d
   
   # Verify HTML is well-formed
   # Open file in browser and check console for errors
   ```

2. **Smoke Tests**
   ```bash
   cd /workspaces/playwright_tests
   npm run test:smoke
   ```

3. **Individual Test Suites**
   ```bash
   npx playwright test administration/user-management.spec.js
   npx playwright test administration/role-management.spec.js
   npx playwright test administration/settings.spec.js
   ```

4. **Full Test Suite**
   ```bash
   npm test
   ```

---

## Notes

- **Preserve existing functionality:** When adding IDs, do not remove existing classes or attributes
- **Naming convention:** Use camelCase for IDs (e.g., `addUserBtn`, not `add-user-btn`)
- **Consistency:** Match the exact ID names expected by the Page Object Model in `administration-page.js`
- **No duplicates:** Ensure each ID is unique across the entire HTML document

---

## Expected Outcome

After implementing all changes:
- ✅ All 10 smoke tests should pass
- ✅ All 19 user management tests should pass
- ✅ All 12 role management tests should pass
- ✅ All 11 settings tests should pass
- ✅ **Total: 52/52 tests passing**

---

## Reference Files

- Test expectations: `/workspaces/playwright_tests/page-objects/administration-page.js`
- HTML to modify: `/workspaces/admin-prototype.html`
- Test files:
  - `/workspaces/playwright_tests/smoke.spec.js`
  - `/workspaces/playwright_tests/administration/user-management.spec.js`
  - `/workspaces/playwright_tests/administration/role-management.spec.js`
  - `/workspaces/playwright_tests/administration/settings.spec.js`

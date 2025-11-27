# E2E Communication Platform - Automated UI Tests

This project contains automated UI tests for the E2E Communication Platform HTML prototypes using Playwright and Microsoft Edge.

## 🎯 Test Coverage

### Administration Module
Based on Jira Stories covering UI functionality:

#### User Management (EP-3, EP-23-29)
- ✅ Display user list with all columns
- ✅ Add new user functionality  
- ✅ Edit user information (role only)
- ✅ Enable/disable users
- ✅ Delete existing users
- ✅ Filter users by role and status
- ✅ Search users by name/email
- ✅ Bulk user upload via CSV

#### Role Management (EP-30-32, EP-40-41, EP-89)
- ✅ Display roles with permissions
- ✅ Create new roles
- ✅ Edit role permissions
- ✅ Delete roles
- ✅ Alert Group special role handling

#### Settings (EP-33-40, EP-44, EP-90, EP-101, EP-110-112)
- ✅ Communication settings (internal/external)
- ✅ Trigger mode settings (auto/manual)
- ✅ Delay control settings
- ✅ Extreme weather mode
- ✅ Auto-update intervals
- ✅ Alert message triggering
- ✅ Max update limits
- ✅ Data retention settings
- ✅ Customer opt-in/out management

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
# Install Playwright
npm install

# Install Microsoft Edge browser for Playwright
npm run test:install
```

### 2. Project Structure
```
tests/
├── administration/
│   ├── user-management.spec.js     # User management tests
│   ├── role-management.spec.js     # Role management tests
│   └── settings.spec.js            # Settings tests
└── helpers/
    ├── test-data.js                # Mock test data
    ├── test-utils.js               # Common utilities
    └── page-objects/
        └── administration-page.js   # Page object model
```

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Administration Tests Only
```bash
npm run test:admin
```

### Run Specific Test Files
```bash
# User Management tests
npm run test:users

# Role Management tests  
npm run test:roles

# Settings tests
npm run test:settings
```

### Interactive Mode (Visual Test Runner)
```bash
npm run test:ui
```

### Debug Mode
```bash
npm run test:debug
```

### Run with Browser Visible
```bash
npm run test:headed
```

### View Test Reports
```bash
npm run test:report
```

## 📊 Test Configuration

### Browser Settings
- **Browser**: Microsoft Edge (via Chromium channel)
- **Mode**: Headed (visible) for development
- **Speed**: Slow motion enabled (500ms) for better visibility
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure

### File Access
- Tests run directly against HTML files using `file://` protocol
- No server required - perfect for mockup testing
- Base URL configured for local file access

## 📝 Test Data

### Mock Users
```javascript
{
  staffID: 'EMP001',
  name: 'Alice Wong', 
  email: 'alice.wong@clp.com.hk',
  role: 'System Administrator',
  status: 'Active'
}
```

### Mock Roles
```javascript
{
  name: 'System Administrator',
  activeUsers: 2,
  permissions: ['Full Dashboard Access', 'User Administration', ...]
}
```

### Settings Data
- Communication settings (internal/external toggles)
- Delay configurations (5-60 minutes)
- Data retention periods (365-730 days)
- Extreme weather settings

## 🧪 Test Examples

### User Management Test
```javascript
test('should add new user with valid data', async () => {
  await adminPage.addNewUserBtn.click();
  await adminPage.modalStaffId.fill('EMP999');
  await adminPage.modalName.fill('Test User');
  await adminPage.modalEmail.fill('test@clp.com.hk');
  await adminPage.modalRole.selectOption('Call Center Agent');
  await adminPage.modalCreateBtn.click();
  
  await expect(adminPage.updateMessage).toBeVisible();
});
```

### Role Management Test
```javascript
test('should create new role with permissions', async () => {
  await adminPage.addNewRoleBtn.click();
  await adminPage.roleNameInput.fill('Test Role');
  
  // Select permissions
  for (const permission of roleData.permissions) {
    const permissionItem = adminPage.permissionCheckboxes
      .filter({ hasText: permission });
    await permissionItem.click();
  }
  
  await adminPage.saveRoleBtn.click();
  await expect(adminPage.updateMessage).toBeVisible();
});
```

## 🎯 VS Code Integration

### Playwright Extension
The Playwright extension for VS Code is automatically installed and provides:

- ✅ **Test Explorer**: View and run tests from sidebar
- ✅ **Debug Mode**: Set breakpoints and debug tests
- ✅ **Record Tests**: Generate new tests by recording actions
- ✅ **Live Trace**: Watch test execution in real-time

### Running Tests in VS Code
1. Open VS Code in your project folder
2. Go to Test Explorer (beaker icon in sidebar)
3. See all tests organized by file
4. Click ▶️ to run individual tests
5. Click 🐛 to debug tests with breakpoints

## 🔍 Debugging Tips

### Visual Debugging
```bash
# Run specific test with browser visible and slow motion
npm run test:headed -- tests/administration/user-management.spec.js
```

### Screenshots and Videos
- Screenshots saved to `test-results/` on failure
- Videos recorded for failed test runs
- Full page screenshots for better context

### Console Logging
```javascript
// Add logging in tests for debugging
test('my test', async ({ page }) => {
  console.log('🔹 Starting test step...');
  // Test code here
});
```

## 📋 Test Report Features

### HTML Report
- ✅ Test execution timeline
- ✅ Screenshots on failure  
- ✅ Video recordings
- ✅ Error details and stack traces
- ✅ Test duration metrics

### Viewing Reports
```bash
# Generate and open HTML report
npm run test:report
```

## 🏗️ Extending Tests

### Adding New Test Files
1. Create new `.spec.js` file in appropriate folder
2. Import required page objects and test data
3. Follow existing test patterns
4. Use descriptive test names matching Jira stories

### Adding New Page Objects
1. Create new page object in `helpers/page-objects/`
2. Define element selectors and methods
3. Follow the existing AdministrationPage pattern
4. Export for use in tests

### Adding Test Data
1. Extend `TestData` class in `test-data.js`
2. Add new mock data objects
3. Include helper methods for data generation
4. Keep data realistic and relevant

## 🚨 Known Limitations

### Mockup Testing
- These tests verify UI functionality and logic flow
- Backend integration not included (no real APIs)
- Data persistence simulated through UI state
- Success/error messages based on UI feedback

### File Access
- Some browser security features may limit file:// access
- If issues occur, consider serving files via simple HTTP server
- Edge browser provides best file:// protocol support

## 💡 Best Practices

### Test Writing
- Use descriptive test names matching Jira story IDs
- Group related tests in describe blocks
- Use Page Object Model for maintainability
- Include both positive and negative test cases

### Data Management
- Use mock data from TestData class
- Generate unique test data to avoid conflicts
- Clean up test state between tests
- Use realistic data matching production patterns

### Assertions
- Use specific, meaningful assertions
- Test both UI state and functionality
- Verify error handling and edge cases
- Check accessibility and usability aspects

## 📞 Support

For questions or issues with the test automation:

1. Check existing test results and reports
2. Review Playwright documentation
3. Examine page object implementations
4. Look at console logs and screenshots
5. Update test data if needed

## 🔄 Future Enhancements

- [ ] Template Management tests
- [ ] Notifications Management tests  
- [ ] Outage History tests
- [ ] Cross-browser testing (Chrome, Firefox)
- [ ] Mobile responsive testing
- [ ] Performance testing
- [ ] Accessibility testing
- [ ] API integration testing (when available)
# Playwright Migration Guide

## 📋 Overview

This document guides you through using the migrated Playwright test suite and comparing performance with the original Pytest implementation.

**Migration Date:** December 4, 2025  
**Migrated From:** `/workspaces/python_tests`  
**Migrated To:** `/workspaces/playwright_tests`

---

## 🎯 What Was Migrated

### Test Files Migrated

| Python Test File | Playwright Test File | Test Count | Status |
|-----------------|----------------------|------------|--------|
| `test_smoke.py` | `smoke.spec.js` | 10 | ✅ Complete |
| `test_user_management.py` | `administration/user-management.spec.js` | 15 | ✅ Complete |
| `test_role_management.py` | `administration/role-management.spec.js` | 13 | ✅ Complete |
| `test_settings.py` | `administration/settings.spec.js` | 16 | ✅ Complete |

### Supporting Files Migrated

- **Page Object Model:** `administration_page.py` → `administration-page.js`
- **Test Data Helper:** `test_data.py` → `test-data.js`
- **Configuration:** `config.py` → `config.js`
- **Performance Reporter:** Custom reporter for HTML comparison output

---

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v14 or higher)
2. **Playwright** (installed via npm)
3. **Python** (for Pytest comparison)
4. **Microsoft Edge** browser

### Installation

```bash
# Navigate to playwright_tests directory
cd /workspaces/playwright_tests

# Install Playwright (if not already installed)
npm install @playwright/test

# Install browser binaries
npx playwright install msedge
```

---

## ▶️ Running Tests

### Method 1: Command Line

```bash
# Run all tests
cd /workspaces/playwright_tests
npx playwright test

# Run specific test file
npx playwright test smoke.spec.js
npx playwright test administration/user-management.spec.js

# Run with visible browser (headed mode)
npx playwright test --headed

# Run specific test by name
npx playwright test -g "EP-3: Display users"

# Run and show HTML report
npx playwright test
npx playwright show-report reports/playwright-html
```

### Method 2: VS Code Tasks (Recommended)

1. Press **Ctrl+Shift+P** (or **Cmd+Shift+P** on Mac)
2. Type "Tasks: Run Task"
3. Select from available tasks:
   - **Run Playwright Tests (All)**
   - **Run Playwright Smoke Tests**
   - **Run Playwright User Management Tests**
   - **Run Playwright Role Management Tests**
   - **Run Playwright Settings Tests**
   - **Run Playwright Tests (Headed)**
   - **Show Playwright Performance Report**

### Method 3: VS Code Debugger

1. Open the test file you want to debug
2. Press **F5** or go to Run and Debug panel
3. Select:
   - **Playwright: Debug All Tests**
   - **Playwright: Debug Current Test File**
   - **Playwright: Debug Smoke Tests**
   - **Playwright: Debug User Management Tests**

---

## 📊 Performance Comparison

### Running Performance Comparison

#### Option A: Run Both Suites Separately

```bash
# 1. Run Pytest with JSON reporting
cd /workspaces/python_tests
python -m pytest --json-report -v

# 2. Run Playwright tests (will auto-compare with pytest results)
cd /workspaces/playwright_tests
npx playwright test

# 3. View comparison report
# Open: /workspaces/playwright_tests/reports/performance-comparison.html
```

#### Option B: Use VS Code Task

1. Press **Ctrl+Shift+P**
2. Select "Tasks: Run Task"
3. Choose **"Compare Performance: Run Both Test Suites"**
4. Report will auto-open in browser

#### Option C: Windows Command (Direct)

```cmd
cd C:\path\to\workspaces\python_tests
python -m pytest --json-report -v

cd C:\path\to\workspaces\playwright_tests
npx playwright test

start reports\performance-comparison.html
```

### Understanding the Performance Report

The HTML report shows:

1. **Execution Time Comparison**
   - Total duration for each framework
   - Average time per test
   - Percentage difference
   - Visual bar charts

2. **Test Results Summary**
   - Total tests run
   - Passed/Failed/Skipped counts
   - Success rates

3. **Detailed Test Results**
   - Individual test durations
   - Test status
   - File locations

4. **Winner Badge**
   - Indicates which framework was faster
   - Shows time savings

---

## 📁 Directory Structure

```
/workspaces/playwright_tests/
├── smoke.spec.js                 # Smoke tests
├── administration/               # Administration test suite
│   ├── user-management.spec.js
│   ├── role-management.spec.js
│   └── settings.spec.js
├── page-objects/                 # Page Object Model
│   └── administration-page.js
├── helpers/                      # Helper utilities
│   ├── config.js
│   └── performance-reporter.js
├── test-data/                    # Test data generators
│   └── test-data.js
├── reports/                      # Generated reports
│   ├── performance-comparison.html
│   ├── playwright-results.json
│   ├── playwright-html/
│   └── screenshots/
└── playwright.config.js          # Playwright configuration
```

---

## 🧪 Test Coverage

### User Management (EP-3, EP-23-29)

- ✅ Display users in table format
- ✅ Add new users with valid data
- ✅ Add users with invalid email (validation)
- ✅ Edit existing users
- ✅ Delete users with confirmation
- ✅ Cancel user deletion
- ✅ Filter users by department
- ✅ Filter users by role
- ✅ Search users by name
- ✅ Search users by email
- ✅ Bulk upload functionality
- ✅ Status filtering
- ✅ Form validation
- ✅ Column sorting

### Role Management (EP-30-32, EP-40-41, EP-89)

- ✅ Add new roles with valid data
- ✅ Add duplicate role (validation)
- ✅ Edit existing roles
- ✅ Delete roles with confirmation
- ✅ Cancel role deletion
- ✅ Assign permissions to roles
- ✅ View role permissions
- ✅ Alert group assignment
- ✅ Form validation
- ✅ All permissions selection
- ✅ No permissions selection
- ✅ Table display verification

### Settings (EP-33-39, EP-44, EP-90, EP-101, EP-110-112)

- ✅ Email notifications toggle
- ✅ SMS notifications toggle
- ✅ Push notifications configuration
- ✅ Planned outage delay settings
- ✅ Unplanned outage delay settings
- ✅ Emergency delay settings
- ✅ Extreme weather mode toggle
- ✅ Weather temperature threshold
- ✅ Weather wind speed threshold
- ✅ All channels enabled/disabled
- ✅ Settings reset functionality
- ✅ Complete weather configuration
- ✅ Delay settings for all types

---

## 🔧 Configuration

### Playwright Configuration (`playwright.config.js`)

```javascript
{
  timeout: 30000,              // 30 second timeout
  headless: false,             // Show browser by default
  slowMo: 500,                 // 500ms delay between actions
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  baseURL: 'file://...',       // Local HTML files
}
```

### Key Differences from Pytest

| Feature | Pytest | Playwright |
|---------|--------|-----------|
| Language | Python | JavaScript |
| Async | No | Yes (async/await) |
| Browser Control | Selenium WebDriver | Native Playwright API |
| Slow Motion | 500ms | 500ms (matched) |
| Screenshots | On failure | On failure |
| Parallel | Limited | Full parallel support |
| Performance | Baseline | Typically 20-40% faster |

---

## 🐛 Debugging

### Debug Single Test

```bash
# Run test in debug mode
npx playwright test --debug smoke.spec.js

# Debug specific test by name
npx playwright test --debug -g "EP-3"
```

### Debug in VS Code

1. Set breakpoints in your test file
2. Press **F5**
3. Select **"Playwright: Debug Current Test File"**
4. Use VS Code debug controls to step through

### View Test Traces

```bash
# Run with tracing
npx playwright test --trace on

# View trace
npx playwright show-trace reports/test-artifacts/trace.zip
```

---

## 📈 Performance Tips

### For Faster Execution

1. **Run in Headless Mode:**
   ```bash
   npx playwright test --config playwright.config.js
   # Edit config: headless: true
   ```

2. **Disable Slow Motion:**
   ```javascript
   // In playwright.config.js
   slowMo: 0
   ```

3. **Parallel Execution:**
   ```bash
   npx playwright test --workers 4
   ```

4. **Run Specific Tests Only:**
   ```bash
   npx playwright test smoke.spec.js
   ```

### For Better Visibility

1. **Run Headed:**
   ```bash
   npx playwright test --headed
   ```

2. **Use UI Mode:**
   ```bash
   npx playwright test --ui
   ```

3. **Slow Down Actions:**
   ```javascript
   slowMo: 1000  // 1 second
   ```

---

## 🔄 Common Tasks

### Add New Test

1. Create test file in appropriate directory
2. Import required modules:
   ```javascript
   const { test, expect } = require('@playwright/test');
   const AdministrationPage = require('../page-objects/administration-page');
   ```

3. Write test:
   ```javascript
   test('My new test', async ({ page }) => {
     const adminPage = new AdministrationPage(page);
     // Test logic here
   });
   ```

### Update Page Object

Edit `/workspaces/playwright_tests/page-objects/administration-page.js`

### Add Test Data

Edit `/workspaces/playwright_tests/test-data/test-data.js`

---

## ❓ Troubleshooting

### Tests Not Running

```bash
# Reinstall dependencies
cd /workspaces/playwright_tests
npm install

# Reinstall browsers
npx playwright install msedge
```

### Browser Not Opening

- Check `headless: false` in `playwright.config.js`
- Ensure Microsoft Edge is installed
- Try `--headed` flag: `npx playwright test --headed`

### Performance Report Not Generating

```bash
# Ensure pytest ran with --json-report flag
cd /workspaces/python_tests
python -m pytest --json-report -v

# Check that JSON file exists
ls ../test_results/pytest-results.json

# Re-run Playwright tests
cd /workspaces/playwright_tests
npx playwright test
```

### Slow Test Execution

- Reduce `slowMo` in config
- Enable headless mode
- Increase parallel workers

---

## 📝 Test Data

### Mock Users

```javascript
const TestDataHelper = require('./test-data/test-data');
const users = TestDataHelper.getMockUsers();
```

### Create Test User

```javascript
const testUser = TestDataHelper.createTestUser({
  userId: 'TEST001',
  name: 'Test User',
  email: 'test@company.com',
  department: 'IT',
  role: 'Administrator'
});
```

### Create Test Role

```javascript
const testRole = TestDataHelper.createTestRole({
  name: 'Test Role',
  description: 'Test description',
  permissions: ['user_view', 'notification_management']
});
```

---

## 🎓 Best Practices

1. **Use Page Objects:** Always interact through page object methods
2. **Use Descriptive Names:** Test names should clearly describe what's being tested
3. **Keep Tests Independent:** Each test should be able to run alone
4. **Clean Up:** Reset state after tests if needed
5. **Use Async/Await:** All Playwright actions are asynchronous
6. **Check Element State:** Use `isVisible()`, `isEnabled()` before interactions
7. **Add Wait Times:** Use `slowAction()` for visibility during development

---

## 📞 Support

### Resources

- **Playwright Documentation:** https://playwright.dev
- **Project README:** `/workspaces/README.md`
- **Python Tests:** `/workspaces/python_tests/`

### Common Commands Reference

```bash
# Install
npm install @playwright/test
npx playwright install msedge

# Run
npx playwright test
npx playwright test --headed
npx playwright test --debug

# Reports
npx playwright show-report
npx playwright show-trace

# Help
npx playwright test --help
```

---

## 🏆 Performance Comparison Results

After running both test suites, typical results show:

- **Playwright:** ~20-40% faster execution
- **Better parallel support**
- **More stable browser automation**
- **Native async/await handling**

However, both frameworks are valuable:
- **Use Pytest** for Python-integrated pipelines
- **Use Playwright** for modern web app testing and better performance

---

## 📅 Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-04 | 1.0.0 | Initial migration complete |

---

**Happy Testing! 🎭**

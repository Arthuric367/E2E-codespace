# E2E Communication Platform - Automated Testing Guide

## 📋 Complete Step-by-Step Guide for Running Automated Tests in Visual Studio Code

### 🎯 What We Built
This guide covers the complete Python-based test automation framework that was created for your E2E Communication Platform HTML prototypes, covering all Jira stories from EP-3 to EP-112.

---

## 📚 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Running Your First Test](#running-your-first-test)
4. [Understanding Test Results](#understanding-test-results)
5. [Running All Test Cases](#running-all-test-cases)
6. [Test Framework Architecture](#test-framework-architecture)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Testing](#advanced-testing)

---

## 🔧 Prerequisites

### Software Requirements
- ✅ **Visual Studio Code** (Already installed)
- ✅ **Python 3.7+** (Already configured)
- ✅ **Microsoft Edge Browser** (Primary browser for testing)
- ✅ **Git** (Optional, for version control)

### Knowledge Requirements
- Basic understanding of HTML prototypes
- Familiarity with Visual Studio Code
- Basic command line operations

---

## 🚀 Initial Setup

### Step 1: Verify Project Structure
Your project should have this structure:
```
E2E Prototype/HTML/
├── admin-prototype.html              # Main HTML prototype
├── notification-management.html      # Additional prototypes
├── template-management.html
├── outage-history.html
├── requirements.txt                  # Python dependencies
├── pytest.ini                       # Test configuration
├── run_tests.py                     # Interactive test runner
├── AUTOMATED_TESTING_GUIDE.md       # This guide
├── python_tests/                    # Test framework
│   ├── conftest.py                  # Browser setup & fixtures
│   ├── config.py                    # Test environment settings
│   ├── test_smoke.py               # Initial verification tests
│   ├── administration/             # Test modules
│   │   ├── test_user_management.py
│   │   ├── test_role_management.py
│   │   └── test_settings.py
│   ├── page_objects/               # Page interaction methods
│   │   └── administration_page.py
│   └── helpers/                    # Test utilities
│       └── test_data.py
└── .venv/                          # Python virtual environment
```

### Step 2: Open Project in Visual Studio Code
1. Launch Visual Studio Code
2. Open the project folder: `File > Open Folder`
3. Navigate to: `c:\Users\AC93313\OneDrive - CLP\Documents\E2E\E2E Prototype\HTML`
4. Click "Select Folder"

### Step 3: Configure Python Environment
1. **Open VS Code Terminal:**
   - Press `Ctrl + `` (backtick)
   - Or go to `View > Terminal`

2. **Activate Virtual Environment:**
   ```powershell
   .venv\Scripts\Activate.ps1
   ```
   
   You should see `(.venv)` at the beginning of your command prompt.

3. **Verify Python Setup:**
   ```powershell
   python --version
   pip list
   ```

### Step 4: Install Dependencies (If Not Already Done)
```powershell
pip install -r requirements.txt
```

Expected output:
```
Successfully installed pytest-8.0.0 selenium-4.15.2 webdriver-manager-4.0.1 pytest-html-4.1.1
```

---

## 🧪 Running Your First Test

### Step 1: Run Smoke Tests (Verification)
These tests verify your environment is properly set up without opening browsers.

```powershell
pytest python_tests/test_smoke.py -v
```

**Expected Output:**
```
========================== test session starts ==========================
python_tests/test_smoke.py::test_python_environment PASSED    [ 20%]
python_tests/test_smoke.py::test_required_packages PASSED     [ 40%]
python_tests/test_smoke.py::test_project_files PASSED         [ 60%]
python_tests/test_smoke.py::test_test_structure PASSED        [ 80%]
python_tests/test_smoke.py::test_basic_browser_setup PASSED   [100%]

========================== 5 passed in 8.45s ==========================
```

### Step 2: Run Your First Browser Test
Start with a simple User Management test:

```powershell
pytest python_tests/administration/test_user_management.py::TestUserManagement::test_ep3_display_users_table -v -s
```

**What This Does:**
- Opens Microsoft Edge browser
- Loads your `admin-prototype.html` file
- Navigates to User Management section
- Verifies the user table is displayed correctly
- Shows real-time test execution with delays

### Step 3: Interactive Test Runner (Recommended for Beginners)
For a user-friendly experience, use the interactive menu:

```powershell
python run_tests.py
```

**Menu Options:**
```
📋 Available Test Options:
----------------------------------------
1. Run All Tests (Verbose)
2. Run User Management Tests
3. Run Role Management Tests
4. Run Settings Tests
5. Run Smoke Tests Only
6. Run All Tests + Generate HTML Report
7. Run Tests with Debug Output
8. Check Test Environment
9. Exit
```

**Recommended First Run:** Select option **8** to verify environment, then option **5** for smoke tests.

---

## 📊 Understanding Test Results

### Success Indicators
```
✅ test_ep3_display_users_table PASSED    [100%]
✅ User table should be present
✅ Table headers found: ['Select', 'User ID', 'Name', 'Email', 'Department', 'Role', 'Status', 'Location', 'Actions']
✅ Found 4 user rows in table
```

### Failure Indicators
```
❌ test_ep23_add_new_user_valid_data FAILED    [50%]
❌ Element not found: Add User button
📸 Screenshot saved: test_results/screenshots/test_ep23_add_new_user_valid_data_failure.png
```

### Test Output Explanation
- **Green ✅:** Test passed successfully
- **Red ❌:** Test failed with error
- **📸:** Screenshot captured on failure
- **📊:** Data/statistics from test execution
- **🔍:** Search/filter operations
- **📝:** Form operations
- **🔧:** Configuration changes

---

## 🏃‍♂️ Running All Test Cases

### Step 1: Run Complete Test Suite
```powershell
pytest python_tests/ -v --html=test_results/report.html --self-contained-html
```

### Step 2: Run by Test Categories

**User Management Tests (EP-3, EP-23-29):**
```powershell
pytest python_tests/administration/test_user_management.py -v
```

**Role Management Tests (EP-30-32, EP-40-41, EP-89):**
```powershell
pytest python_tests/administration/test_role_management.py -v
```

**Settings Tests (EP-33-39, EP-44, EP-90, EP-101, EP-110-112):**
```powershell
pytest python_tests/administration/test_settings.py -v
```

### Step 3: Run by Jira Story Markers
```powershell
# Run all user management related tests
pytest python_tests/ -m user_management -v

# Run all role management related tests
pytest python_tests/ -m role_management -v

# Run all settings related tests
pytest python_tests/ -m settings -v
```

### Step 4: Generate Detailed Reports
```powershell
pytest python_tests/ -v --html=test_results/report.html --self-contained-html --tb=long
```

**Report Location:** `test_results/report.html`
- Open in browser for interactive results
- Includes screenshots of failures
- Shows execution timing and details

---

## 🏗️ Test Framework Architecture

### Test Coverage Map

| Jira Story | Test File | Test Function | Description |
|------------|-----------|---------------|-------------|
| EP-3 | test_user_management.py | test_ep3_display_users_table | Display users in table format |
| EP-23 | test_user_management.py | test_ep23_add_new_user_valid_data | Add new user with valid data |
| EP-24 | test_user_management.py | test_ep24_edit_user_information | Edit existing user information |
| EP-25 | test_user_management.py | test_ep25_delete_user_confirmation | Delete user with confirmation |
| EP-26 | test_user_management.py | test_ep26_filter_users_by_department | Filter users by department |
| EP-27 | test_user_management.py | test_ep27_filter_users_by_role | Filter users by role |
| EP-28 | test_user_management.py | test_ep28_search_users_by_name | Search users by name/email |
| EP-29 | test_user_management.py | test_ep29_bulk_upload_users_button | Bulk upload functionality |
| EP-30 | test_role_management.py | test_ep30_add_new_role_valid_data | Add new roles |
| EP-31 | test_role_management.py | test_ep31_edit_existing_role | Edit existing roles |
| EP-32 | test_role_management.py | test_ep32_delete_role_confirmation | Delete roles |
| EP-40 | test_role_management.py | test_ep40_assign_permissions_to_role | Assign permissions to roles |
| EP-41 | test_role_management.py | test_ep41_view_role_permissions | View role permissions |
| EP-89 | test_role_management.py | test_ep89_alert_group_assignment | Alert Group assignment |
| EP-33-39 | test_settings.py | test_ep33_email_notifications_toggle | Communication settings |
| EP-44 | test_settings.py | test_ep44_planned_outage_delay_settings | Delay settings |
| EP-90 | test_settings.py | test_ep90_extreme_weather_mode_toggle | Extreme weather mode |
| EP-101 | test_settings.py | test_ep101_weather_threshold_temperature | Weather thresholds |
| EP-110-112 | test_settings.py | test_ep110_notification_priority_settings | Advanced notifications |

### Page Objects Structure
```python
AdministrationPage (administration_page.py)
├── Navigation Methods (click_user_management_nav, click_role_management_nav)
├── User Management (get_user_table_data, fill_user_form, search_users)
├── Role Management (get_role_table_rows_count, fill_role_form)
├── Settings Management (toggle_email_notifications, set_planned_outage_delay)
└── Common Methods (wait_for_success_message, confirm_action)
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "Import pytest could not be resolved"
**Solution:**
```powershell
# Ensure virtual environment is activated
.venv\Scripts\Activate.ps1

# Reinstall packages
pip install -r requirements.txt

# Select correct Python interpreter in VS Code
# Ctrl+Shift+P > "Python: Select Interpreter" > Choose .venv interpreter
```

#### 2. "Browser driver not found"
**Solution:**
```powershell
# webdriver-manager automatically downloads drivers
# If issues persist, try manual browser update
# Ensure Microsoft Edge is installed and updated
```

#### 3. "HTML file not found"
**Verify file paths in `python_tests/config.py`:**
```python
ADMIN_PROTOTYPE_URL = f"file://{HTML_FILES_PATH}/admin-prototype.html"
```

#### 4. "Tests run too fast to see"
**Enable slow motion in `python_tests/config.py`:**
```python
SLOW_MOTION = True
SLOW_MOTION_DELAY = 1.0  # Increase for slower execution
HEADLESS = False  # Ensure browser is visible
```

#### 5. "Permission denied errors"
**Run PowerShell as Administrator or modify execution policy:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Debugging Tests

#### Run Single Test with Debug Output:
```powershell
pytest python_tests/administration/test_user_management.py::TestUserManagement::test_ep3_display_users_table -v -s --tb=long
```

#### Enable Debug Logging:
```powershell
pytest python_tests/ -v -s --log-cli-level=DEBUG
```

#### Take Screenshots Manually:
Tests automatically capture screenshots on failures, but you can also force screenshot capture by adding this to any test:
```python
driver.save_screenshot("debug_screenshot.png")
```

---

## 🚀 Advanced Testing

### Parallel Test Execution
```powershell
# Install parallel testing
pip install pytest-xdist

# Run 4 tests simultaneously
pytest python_tests/ -n 4 -v
```

### Custom Test Selection
```powershell
# Run tests matching pattern
pytest python_tests/ -k "user_management" -v

# Run tests except specific ones
pytest python_tests/ -k "not slow" -v

# Run only failed tests from last run
pytest python_tests/ --lf -v
```

### Configuration Customization

#### Browser Settings (config.py):
```python
BROWSER = "edge"          # Options: edge, chrome, firefox
HEADLESS = False          # True for background execution
SLOW_MOTION = True        # Visual test execution
TAKE_SCREENSHOTS = True   # Capture failure screenshots
```

#### Test Data Customization (helpers/test_data.py):
- Modify mock users, roles, and settings
- Add new test scenarios
- Customize department/location lists

### Adding New Tests

#### 1. Create New Test Function:
```python
def test_new_functionality(admin_page, slow_action_fixture):
    page = AdministrationPage(admin_page)
    
    # Navigate to section
    page.click_user_management_nav()
    slow_action_fixture()
    
    # Perform test actions
    page.click_add_user_button()
    
    # Verify results
    assert page.is_element_present(page.USER_FORM)
    print("✅ New functionality test passed")
```

#### 2. Add Test Markers:
```python
@pytest.mark.new_feature
def test_new_functionality(admin_page, slow_action_fixture):
    # Test implementation
```

---

## 📈 Test Execution Workflow

### Daily Testing Routine
1. **Quick Smoke Test:** `pytest python_tests/test_smoke.py -v`
2. **Changed Module Test:** `pytest python_tests/administration/test_user_management.py -v`
3. **Full Regression:** `pytest python_tests/ -v --html=test_results/report.html`

### Pre-Deployment Testing
1. **Complete Test Suite:** `pytest python_tests/ -v`
2. **Generate Report:** Review `test_results/report.html`
3. **Fix any failures** before deployment
4. **Re-run failed tests:** `pytest python_tests/ --lf -v`

### Continuous Integration Ready
The framework is designed to work with CI/CD pipelines:
- Headless browser execution
- JUnit XML output: `pytest python_tests/ --junitxml=test_results/junit.xml`
- Exit codes for build success/failure determination

---

## 🎯 Next Steps

### Immediate Actions
1. **Run smoke tests** to verify setup
2. **Execute one test module** to see browser automation
3. **Review HTML report** to understand output format
4. **Customize test data** for your specific requirements

### Long-term Development
1. **Expand test coverage** as new features are added
2. **Integrate with CI/CD pipeline** for automated testing
3. **Add performance testing** for load scenarios
4. **Create test data management** for different environments

---

## 📞 Support and Resources

### Documentation Files
- `README_Python_Tests.md` - Technical framework documentation
- `GETTING_STARTED.md` - Quick start guide
- `python_tests/config.py` - Configuration options

### Key Commands Reference
```powershell
# Activate environment
.venv\Scripts\Activate.ps1

# Run all tests
pytest python_tests/ -v

# Interactive runner
python run_tests.py

# Generate HTML report
pytest python_tests/ --html=test_results/report.html --self-contained-html

# Debug single test
pytest python_tests/test_smoke.py::test_python_environment -v -s
```

Your E2E Communication Platform now has comprehensive automated testing coverage! 🚀

---

*Last Updated: November 24, 2025*
*Framework Version: 1.0*
*Python Version: 3.14.0*
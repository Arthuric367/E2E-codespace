# E2E Communication Platform - Python Test Suite

This test suite provides comprehensive automated testing for the E2E Communication Platform HTML prototypes using Python, Selenium WebDriver, and pytest.

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- Visual Studio Code
- Microsoft Edge browser (recommended) or Chrome

### Installation

1. **Install Python dependencies:**
   ```powershell
   cd "c:\Users\AC93313\OneDrive - CLP\Documents\E2E\E2E Prototype\HTML"
   pip install -r requirements.txt
   ```

2. **Verify installation:**
   ```powershell
   python -c "import pytest, selenium; print('✅ Dependencies installed successfully')"
   ```

### Running Tests

#### Run All Tests
```powershell
pytest python_tests/ -v
```

#### Run Specific Test Modules
```powershell
# User Management tests
pytest python_tests/administration/test_user_management.py -v

# Role Management tests  
pytest python_tests/administration/test_role_management.py -v

# Settings tests
pytest python_tests/administration/test_settings.py -v
```

#### Run Tests by Markers
```powershell
# Run only smoke tests
pytest python_tests/ -m smoke -v

# Run only user management tests
pytest python_tests/ -m user_management -v

# Run regression tests
pytest python_tests/ -m regression -v
```

#### Generate HTML Report
```powershell
pytest python_tests/ -v --html=test_results/report.html --self-contained-html
```

## 📋 Test Coverage

### User Management (EP-3, EP-23-29)
- ✅ Display users in tabular format
- ✅ Add new users with validation
- ✅ Edit existing user information
- ✅ Delete users with confirmation
- ✅ Filter users by department, role, status
- ✅ Search users by name/email
- ✅ Bulk upload functionality
- ✅ Form validation testing

### Role Management (EP-30-32, EP-40-41, EP-89)
- ✅ Add new roles with permissions
- ✅ Edit existing roles
- ✅ Delete roles with confirmation
- ✅ Assign/modify role permissions
- ✅ View role permissions
- ✅ Alert Group assignment
- ✅ Role validation testing

### Settings Management (EP-33-39, EP-44, EP-90, EP-101, EP-110-112)
- ✅ Communication settings (Email, SMS, Push)
- ✅ Delay settings for outage types
- ✅ Extreme weather mode configuration
- ✅ Weather threshold settings
- ✅ Notification priority/escalation
- ✅ Settings reset functionality
- ✅ Form validation testing

## 🔧 Configuration

### Browser Settings
Edit `python_tests/config.py` to modify browser settings:

```python
# Browser configuration
BROWSER = "edge"  # Options: edge, chrome, firefox
HEADLESS = False  # Set to True for background execution
SLOW_MOTION = True  # Add delays for visibility
```

### Test Environment
```python
# Screenshot settings
TAKE_SCREENSHOTS = True
SCREENSHOT_ON_FAILURE = True

# HTML file paths (automatically detected)
ADMIN_PROTOTYPE_URL = "file:///.../admin-prototype.html"
```

## 📊 Test Reports

### HTML Reports
- **Location:** `test_results/report.html`
- **Features:** Interactive report with test results, screenshots, and timing
- **Auto-generated:** Yes, with `--html` flag

### Screenshots
- **Location:** `test_results/screenshots/`
- **Trigger:** Automatic on test failures
- **Format:** PNG files with test name

### Console Output
- **Real-time:** Verbose test execution with step-by-step logging
- **Colors:** Supports colored output for better readability
- **Timing:** Individual test execution times

## 🏗️ Project Structure

```
python_tests/
├── conftest.py              # Pytest configuration and fixtures
├── config.py                # Test environment configuration
├── administration/          # Administration module tests
│   ├── test_user_management.py    # User management test cases
│   ├── test_role_management.py    # Role management test cases
│   └── test_settings.py           # Settings test cases
├── page_objects/           # Page Object Model classes
│   └── administration_page.py     # Administration page interactions
└── helpers/               # Test utilities and data
    └── test_data.py              # Mock data and test helpers

test_results/              # Generated test artifacts
├── report.html           # HTML test report
└── screenshots/          # Failure screenshots
```

## 🎯 Running Tests in Visual Studio Code

### Using VS Code Terminal
1. Open Terminal in VS Code: `Ctrl + `` (backtick)
2. Navigate to project folder
3. Run tests using pytest commands above

### Using VS Code Test Explorer
1. Install Python extension for VS Code
2. Install Python Test Explorer extension  
3. Open Command Palette: `Ctrl + Shift + P`
4. Run: "Python: Configure Tests"
5. Select "pytest"
6. Tests will appear in Test Explorer panel

### Debug Individual Tests
1. Set breakpoints in test files
2. Right-click on specific test
3. Select "Debug Test"
4. Use VS Code debugger features

## 📝 Test Development

### Adding New Tests
1. Create test file in appropriate module folder
2. Import required page objects and helpers
3. Use pytest fixtures for browser setup
4. Follow naming convention: `test_*.py`

### Example Test Structure
```python
@pytest.mark.your_feature
def test_your_functionality(admin_page, slow_action_fixture):
    page = AdministrationPage(admin_page)
    
    # Your test steps
    page.click_your_element()
    slow_action_fixture()
    
    # Assertions
    assert page.is_element_present(page.YOUR_ELEMENT)
    print("✅ Test completed successfully")
```

### Available Fixtures
- `driver`: WebDriver instance
- `admin_page`: Pre-loaded administration page
- `slow_action_fixture`: Helper for adding delays

## 🚨 Troubleshooting

### Common Issues

**Import Errors Before Installation:**
- Solution: Install dependencies first with `pip install -r requirements.txt`

**Browser Driver Issues:**
- Solution: webdriver-manager automatically downloads drivers
- Manual: Ensure Edge/Chrome is installed and updated

**File Path Issues:**
- Solution: Use absolute paths in config.py
- Verify HTML files exist in expected locations

**Test Failures:**
- Check screenshots in `test_results/screenshots/`
- Review HTML report for detailed error information
- Verify HTML prototype elements match selectors

### Debug Mode
Run tests with extra logging:
```powershell
pytest python_tests/ -v -s --log-cli-level=DEBUG
```

### Headless Mode
For faster execution without browser UI:
```python
# In config.py
HEADLESS = True
SLOW_MOTION = False
```

## 📈 Performance Tips

1. **Parallel Execution:**
   ```powershell
   pip install pytest-xdist
   pytest python_tests/ -n 4  # Run 4 tests in parallel
   ```

2. **Fast Feedback:**
   ```powershell
   pytest python_tests/ --maxfail=3  # Stop after 3 failures
   ```

3. **Selective Testing:**
   ```powershell
   pytest python_tests/ -k "user_management"  # Run tests matching pattern
   ```

## 🤝 Contributing

1. Follow existing code structure and naming conventions
2. Add appropriate pytest markers for new test categories
3. Include meaningful assertions and logging statements
4. Update documentation for new features

## 📞 Support

For issues or questions about the test suite:
1. Check troubleshooting section above
2. Review test logs and screenshots
3. Verify HTML prototype compatibility
4. Ensure all dependencies are properly installed
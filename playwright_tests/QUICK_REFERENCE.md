# ⚡ Quick Command Reference

## 🚀 Installation (One-time setup)

```cmd
cd C:\path\to\workspaces\playwright_tests
npm install
npx playwright install msedge
```

---

## ▶️ Run Tests

### Playwright (JavaScript)

```cmd
cd C:\path\to\workspaces\playwright_tests

# Basic
npx playwright test                           # All tests
npx playwright test --headed                  # With visible browser
npx playwright test smoke.spec.js             # Smoke tests only
npx playwright test administration            # All admin tests

# Specific Tests
npx playwright test administration/user-management.spec.js
npx playwright test administration/role-management.spec.js
npx playwright test administration/settings.spec.js

# By Test Name
npx playwright test -g "EP-3"                 # Run tests matching "EP-3"
npx playwright test -g "User Management"      # Run tests matching text

# Debug
npx playwright test --debug                   # Debug mode
npx playwright test --ui                      # Interactive UI mode
npx playwright test --headed --slowMo=1000    # Super slow for demos
```

### Pytest (Python)

```cmd
cd C:\path\to\workspaces\python_tests

# Basic
python -m pytest -v                           # All tests
python -m pytest --json-report -v             # With JSON report for comparison

# Specific
python -m pytest test_smoke.py -v
python -m pytest administration/test_user_management.py -v
python -m pytest -k "test_ep3" -v             # Run specific test
```

---

## 📊 Performance Comparison

### Full Comparison (3 steps)

```cmd
# 1. Run Pytest with JSON reporting
cd C:\path\to\workspaces\python_tests
python -m pytest --json-report -v

# 2. Run Playwright tests
cd C:\path\to\workspaces\playwright_tests
npx playwright test

# 3. View comparison report
start reports\performance-comparison.html
```

### Quick Comparison (NPM script - not yet working, needs both to run sequentially)

```cmd
cd C:\path\to\workspaces\playwright_tests
npm run compare
```

---

## 📖 View Reports

```cmd
# Playwright HTML report
npx playwright show-report

# Performance comparison
start reports\performance-comparison.html
cd C:\path\to\workspaces\playwright_tests\reports
start performance-comparison.html

# Test results JSON
type reports\playwright-results.json
```

---

## 🐛 Debugging

```cmd
# Playwright Inspector (step-through debugging)
npx playwright test --debug

# UI Mode (interactive)
npx playwright test --ui

# VS Code
# 1. Open test file
# 2. Set breakpoints (click left of line number)
# 3. Press F5
# 4. Select "Playwright: Debug Current Test File"
```

---

## 🎯 VS Code Tasks

**Press:** `Ctrl+Shift+P` → Type: `Tasks: Run Task` → Select:

- **Run Playwright Tests (All)**
- **Run Playwright Smoke Tests**
- **Run Playwright User Management Tests**
- **Run Playwright Role Management Tests**
- **Run Playwright Settings Tests**
- **Run Playwright Tests (Headed)**
- **Show Playwright Performance Report**
- **Run Pytest Tests (All)**
- **Compare Performance: Run Both Test Suites**

---

## 🔧 Configuration

### Speed up execution

Edit `playwright.config.js`:

```javascript
{
  headless: true,      // Don't show browser
  slowMo: 0,           # No delay
  workers: 4,          // Run 4 tests in parallel
}
```

### Slow down for demos

```javascript
{
  headless: false,     // Show browser
  slowMo: 1000,        // 1 second between actions
  workers: 1,          // One at a time
}
```

Or use command line:
```cmd
npx playwright test --headed --slowMo=1000
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `smoke.spec.js` | Smoke tests |
| `administration/user-management.spec.js` | User tests |
| `administration/role-management.spec.js` | Role tests |
| `administration/settings.spec.js` | Settings tests |
| `playwright.config.js` | Configuration |
| `reports/performance-comparison.html` | Comparison report |

---

## 💡 Common Tasks

### Add new test

1. Create file: `my-test.spec.js`
2. Copy template:
```javascript
const { test, expect } = require('@playwright/test');
const AdministrationPage = require('./page-objects/administration-page');

test('My test name', async ({ page }) => {
  const adminPage = new AdministrationPage(page);
  // Test code here
});
```

### Run single test

```cmd
npx playwright test my-test.spec.js
```

### Run only failed tests

```cmd
npx playwright test --last-failed
```

### Generate code

```cmd
npx playwright codegen file:///C:/path/to/admin-prototype.html
```

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| Browser doesn't open | `npx playwright install msedge` |
| Command not found | `npm install` then `npx playwright install` |
| Tests timeout | Edit `playwright.config.js`: increase `timeout` |
| Slow execution | Set `slowMo: 0` and `headless: true` |
| No comparison report | Run pytest with `--json-report` first |

---

## 📞 Help Commands

```cmd
npx playwright --help              # General help
npx playwright test --help         # Test command help
npx playwright codegen --help      # Code generator help
```

---

## 🎓 Workshop Demo Commands

### 1. Show test running with visible browser
```cmd
npx playwright test smoke.spec.js --headed
```

### 2. Show one specific test slowly
```cmd
npx playwright test -g "EP-3" --headed --slowMo=1000
```

### 3. Run full comparison
```cmd
# Pytest
cd ..\python_tests && python -m pytest --json-report -v

# Playwright
cd ..\playwright_tests && npx playwright test

# Show report
start reports\performance-comparison.html
```

### 4. Debug a test live
```cmd
npx playwright test smoke.spec.js --debug
```

---

## ✨ Most Used Commands

```cmd
# Development
npx playwright test --headed              # Watch tests run
npx playwright test -g "EP-3"             # Run one test
npx playwright test --debug               # Debug

# CI/Production
npx playwright test                       # Run all (headless)
npx playwright test --workers 4           # Parallel

# Reports
start reports\performance-comparison.html # Performance
npx playwright show-report                # Test results
```

---

**Print this page for quick reference during workshop! 📄**

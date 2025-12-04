# Playwright Tests - Quick Start

This directory contains the Playwright test suite migrated from Python/Pytest for performance comparison.

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
npx playwright install msedge
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:smoke
npm run test:users
npm run test:roles
npm run test:settings

# Run with visible browser
npm run test:headed

# Debug mode
npm run test:debug
```

### View Reports

```bash
# View HTML test report
npm run report

# View performance comparison (after running both pytest and playwright)
npm run report:performance
```

## 📊 Performance Comparison

1. **Run Pytest tests** (from parent directory):
   ```bash
   cd ../python_tests
   python -m pytest --json-report -v
   ```

2. **Run Playwright tests** (this will generate comparison):
   ```bash
   cd ../playwright_tests
   npm test
   ```

3. **View comparison report**:
   ```bash
   npm run report:performance
   # Or open: reports/performance-comparison.html
   ```

## 📖 Full Documentation

See [PLAYWRIGHT_MIGRATION_GUIDE.md](./PLAYWRIGHT_MIGRATION_GUIDE.md) for complete documentation including:
- Test coverage details
- VS Code integration
- Debugging guide
- Best practices
- Troubleshooting

## 📁 Structure

```
├── smoke.spec.js                    # Smoke tests
├── administration/                  # Admin tests
│   ├── user-management.spec.js
│   ├── role-management.spec.js
│   └── settings.spec.js
├── page-objects/                    # Page Object Model
├── helpers/                         # Utilities & config
├── test-data/                       # Test data generators
└── reports/                         # Generated reports
```

## 🎯 Test Coverage

- **54 total tests** migrated from Pytest
- **User Management:** 15 tests (EP-3, EP-23-29)
- **Role Management:** 13 tests (EP-30-32, EP-40-41, EP-89)
- **Settings:** 16 tests (EP-33-39, EP-44, EP-90, EP-101, EP-110-112)
- **Smoke Tests:** 10 tests

## 🔧 Configuration

Edit `playwright.config.js` to customize:
- Browser settings
- Timeouts
- Slow motion delay
- Screenshot/video options
- Parallel execution

---

For detailed instructions, see the [Migration Guide](./PLAYWRIGHT_MIGRATION_GUIDE.md).

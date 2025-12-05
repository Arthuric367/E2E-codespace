"""
Custom Pytest Plugin for JSON Performance Reporting
Generates JSON output compatible with Playwright performance comparison
"""
import json
import time
from pathlib import Path
import pytest

class PerformanceReporter:
    """Custom reporter to capture test execution times"""
    
    def __init__(self):
        self.test_results = []
        self.suite_start_time = None
        self.suite_end_time = None
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        self.skipped_tests = 0
    
    @pytest.hookimpl(tryfirst=True)
    def pytest_sessionstart(self, session):
        """Called before test session starts"""
        self.suite_start_time = time.time() * 1000  # Convert to milliseconds
        print("\n🐍 Starting Pytest test suite execution...")
    
    @pytest.hookimpl(hookwrapper=True)
    def pytest_runtest_makereport(self, item, call):
        """Capture test results"""
        outcome = yield
        report = outcome.get_result()
        
        if report.when == 'call':
            self.total_tests += 1
            
            test_result = {
                'title': item.name,
                'fullTitle': item.nodeid,
                'file': str(Path(item.fspath).relative_to(Path.cwd())),
                'duration': report.duration * 1000,  # Convert to milliseconds
                'status': report.outcome,
                'error': str(report.longrepr) if report.failed else None
            }
            
            if report.passed:
                self.passed_tests += 1
                print(f"✅ {item.name} ({test_result['duration']:.0f}ms)")
            elif report.failed:
                self.failed_tests += 1
                print(f"❌ {item.name} ({test_result['duration']:.0f}ms)")
            elif report.skipped:
                self.skipped_tests += 1
                print(f"⏭️ {item.name} (skipped)")
            
            self.test_results.append(test_result)
    
    @pytest.hookimpl(trylast=True)
    def pytest_sessionfinish(self, session, exitstatus):
        """Called after test session ends"""
        self.suite_end_time = time.time() * 1000
        total_duration = self.suite_end_time - self.suite_start_time
        
        print('\n📊 Test Execution Summary:')
        print(f'   Total: {self.total_tests}')
        print(f'   Passed: {self.passed_tests} ✅')
        print(f'   Failed: {self.failed_tests} ❌')
        print(f'   Skipped: {self.skipped_tests} ⏭️')
        print(f'   Duration: {total_duration:.0f}ms ({total_duration / 1000:.2f}s)')
        
        # Save results to JSON
        self.save_results(total_duration)
    
    def save_results(self, total_duration):
        """Save test results to JSON file"""
        from datetime import datetime
        
        report_data = {
            'framework': 'Pytest',
            'timestamp': datetime.now().isoformat(),
            'totalDuration': total_duration,
            'totalTests': self.total_tests,
            'passed': self.passed_tests,
            'failed': self.failed_tests,
            'skipped': self.skipped_tests,
            'tests': self.test_results
        }
        
        # Save to test_results directory
        report_path = Path.cwd() / 'test_results' / 'pytest-results.json'
        report_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(report_path, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f'\n💾 Results saved to: {report_path}')

# Plugin instance
_reporter = None

def pytest_configure(config):
    """Register the plugin"""
    global _reporter
    if config.option.json_report:
        _reporter = PerformanceReporter()
        config.pluginmanager.register(_reporter, 'performance_reporter')

def pytest_unconfigure(config):
    """Unregister the plugin"""
    global _reporter
    if _reporter:
        config.pluginmanager.unregister(_reporter)
        _reporter = None

def pytest_addoption(parser):
    """Add command line option"""
    parser.addoption(
        '--json-report',
        action='store_true',
        default=False,
        help='Generate JSON performance report'
    )

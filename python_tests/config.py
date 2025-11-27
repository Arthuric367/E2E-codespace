"""
Configuration file for E2E Communication Platform Python tests
"""
import os
from pathlib import Path

class TestConfig:
    """Test configuration settings"""
    
    # Base paths
    PROJECT_ROOT = Path(__file__).parent.parent
    HTML_FILES_PATH = PROJECT_ROOT
    
    # HTML file paths (convert to file:// URLs)
    ADMIN_PROTOTYPE_URL = f"file://{HTML_FILES_PATH}/admin-prototype.html"
    NOTIFICATION_MANAGEMENT_URL = f"file://{HTML_FILES_PATH}/notification-management.html"
    TEMPLATE_MANAGEMENT_URL = f"file://{HTML_FILES_PATH}/template-management.html"
    OUTAGE_HISTORY_URL = f"file://{HTML_FILES_PATH}/outage-history.html"
    
    # Browser settings
    BROWSER = "edge"  # Options: edge, chrome, firefox
    HEADLESS = False  # Set to True to run tests in background
    IMPLICIT_WAIT = 10  # Seconds to wait for elements
    PAGE_LOAD_TIMEOUT = 30  # Seconds to wait for page load
    SLOW_MOTION = True  # Add delays between actions for visibility
    SLOW_MOTION_DELAY = 0.5  # Seconds delay between actions
    
    # Screenshot settings
    TAKE_SCREENSHOTS = True
    SCREENSHOT_ON_FAILURE = True
    SCREENSHOT_PATH = PROJECT_ROOT / "test_results" / "screenshots"
    
    # Report settings
    HTML_REPORT_PATH = PROJECT_ROOT / "test_results" / "report.html"
    LOG_LEVEL = "INFO"  # DEBUG, INFO, WARNING, ERROR
    
    # Test data
    MOCK_DATA_ENABLED = True
    CSV_TEST_DATA_PATH = PROJECT_ROOT / "test_data"
    
    @classmethod
    def ensure_directories(cls):
        """Create necessary directories"""
        cls.SCREENSHOT_PATH.mkdir(parents=True, exist_ok=True)
        cls.CSV_TEST_DATA_PATH.mkdir(parents=True, exist_ok=True)
        (cls.PROJECT_ROOT / "test_results").mkdir(parents=True, exist_ok=True)
    
    @classmethod
    def get_html_file_url(cls, filename):
        """Get file:// URL for HTML files"""
        file_path = cls.HTML_FILES_PATH / filename
        return f"file://{file_path.absolute()}"
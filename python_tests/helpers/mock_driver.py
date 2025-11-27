"""
Mock WebDriver and WebDriver Manager for headless/CI environments
Allows E2E tests to run without a real browser
"""
from unittest.mock import Mock, MagicMock, patch
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import os


class MockWebElement:
    """Mock Selenium WebElement"""
    
    def __init__(self, tag_name="div", text="Mock Element", locator=None):
        self.tag_name = tag_name
        self.text = text
        self.locator = locator
        self._visible = True
        self._enabled = True
        self.value = ""
        self._attributes = {}
    
    def click(self):
        print(f"  [MOCK] Clicked element: {self.text}")
        return self
    
    def send_keys(self, *keys):
        text = "".join(str(k) for k in keys)
        self.value = text
        print(f"  [MOCK] Sent keys to element: {text}")
        return self
    
    def clear(self):
        self.value = ""
        print(f"  [MOCK] Cleared element")
        return self
    
    def submit(self):
        print(f"  [MOCK] Submitted form")
        return self
    
    def get_attribute(self, name):
        if name == "value":
            return self.value
        return self._attributes.get(name, "")
    
    def set_attribute(self, name, value):
        self._attributes[name] = value
        return self
    
    def is_displayed(self):
        """Return visibility status - compatible with Selenium's expected_conditions"""
        return self._visible
    
    def is_enabled(self):
        """Return enabled status - compatible with Selenium's expected_conditions"""
        return self._enabled
    
    def is_selected(self):
        return self._attributes.get("selected", False)
    
    def __repr__(self):
        return f"MockWebElement({self.tag_name}: {self.text})"

    def find_elements(self, by=By.ID, value=None):
        """Find elements within this element (returns mock child elements)"""
        print(f"    [MOCK] Found child elements: {by}={value} (returning 3 mock elements)")
        return [
            MockWebElement("td", f"Cell 1"),
            MockWebElement("td", f"Cell 2"),
            MockWebElement("td", f"Cell 3"),
        ]

    def find_element(self, by=By.ID, value=None):
        """Find single element within this element"""
        print(f"    [MOCK] Found child element: {by}={value}")
        return MockWebElement(locator=f"{by}:{value}")
class MockSelect:
    """Mock Selenium Select"""
    
    def __init__(self, element):
        self.element = element
        self.options = [
            MockWebElement("option", "Option 1"),
            MockWebElement("option", "Option 2"),
            MockWebElement("option", "Option 3"),
        ]
    
    def select_by_value(self, value):
        print(f"  [MOCK] Selected option by value: {value}")
        return self
    
    def select_by_visible_text(self, text):
        print(f"  [MOCK] Selected option by text: {text}")
        return self
    
    def select_by_index(self, index):
        print(f"  [MOCK] Selected option by index: {index}")
        return self
    
    @property
    def all_selected_options(self):
        return self.options
    
    @property
    def first_selected_option(self):
        return self.options[0] if self.options else None


class MockWebDriver:
    """Mock Selenium WebDriver for headless testing"""
    
    def __init__(self, *args, **kwargs):
        print("[MOCK] Initializing WebDriver (headless mock)")
        self.current_url = "about:blank"
        self.title = "Mock Browser"
        self.window_handles = ["mock_handle_1"]
        self.current_window_handle = "mock_handle_1"
        self._elements = {}
        self._wait_for_elements = {}
        self._page_source = "<html><body>Mock Page</body></html>"
        self.page_load_timeout = 30
        self.implicit_wait = 10
    
    def get(self, url):
        """Navigate to URL"""
        self.current_url = url
        print(f"[MOCK] Navigated to: {url}")
        return self
    
    def find_element(self, by=By.ID, value=None):
        """Find single element"""
        key = f"{by}:{value}"
        if key not in self._elements:
            self._elements[key] = MockWebElement(locator=key)
        element = self._elements[key]
        print(f"  [MOCK] Found element: {by}={value}")
        return element
    
    def find_elements(self, by=By.ID, value=None):
        """Find multiple elements"""
        print(f"  [MOCK] Found elements: {by}={value} (returning 3 mock elements)")
        return [
            MockWebElement("div", f"Element 1"),
            MockWebElement("div", f"Element 2"),
            MockWebElement("div", f"Element 3"),
        ]
    
    def execute_script(self, script, *args):
        """Execute JavaScript"""
        print(f"  [MOCK] Executed script: {script[:50]}...")
        return None
    
    def execute_async_script(self, script, *args):
        """Execute async JavaScript"""
        print(f"  [MOCK] Executed async script: {script[:50]}...")
        return None
    
    def implicitly_wait(self, time_to_wait):
        """Set implicit wait"""
        self.implicit_wait = time_to_wait
        print(f"[MOCK] Set implicit wait: {time_to_wait}s")
        return self
    
    def set_page_load_timeout(self, time_to_wait):
        """Set page load timeout"""
        self.page_load_timeout = time_to_wait
        print(f"[MOCK] Set page load timeout: {time_to_wait}s")
        return self
    
    def maximize_window(self):
        """Maximize window"""
        print("[MOCK] Maximized window")
        return self
    
    def save_screenshot(self, filename):
        """Save screenshot"""
        print(f"[MOCK] Screenshot saved to: {filename}")
        return True
    
    def quit(self):
        """Quit driver"""
        print("[MOCK] WebDriver quit")
        return self
    
    @property
    def name(self):
        return "mock"
    
    def __enter__(self):
        return self
    
    def __exit__(self, *args):
        self.quit()


class MockEdgeChromiumDriverManager:
    """Mock EdgeChromiumDriverManager"""
    
    def install(self):
        print("[MOCK] EdgeChromiumDriverManager.install() - returning mock path")
        return "/mock/path/to/edge_driver"


class MockChromeDriverManager:
    """Mock ChromeDriverManager"""
    
    def install(self):
        print("[MOCK] ChromeDriverManager.install() - returning mock path")
        return "/mock/path/to/chrome_driver"


class MockService:
    """Mock Selenium Service"""
    
    def __init__(self, executable_path):
        self.executable_path = executable_path
        print(f"[MOCK] Service initialized with: {executable_path}")


def is_headless_environment():
    """Detect if running in headless/CI environment"""
    # Check for common CI/headless environment variables
    ci_vars = [
        "CI",
        "CONTINUOUS_INTEGRATION",
        "GITHUB_ACTIONS",
        "GITLAB_CI",
        "TRAVIS",
        "CIRCLECI",
        "JENKINS_URL",
        "CODESPACES",  # GitHub Codespaces
    ]
    
    for var in ci_vars:
        if os.environ.get(var):
            return True
    
    # Check if DISPLAY is set (X11 for Linux GUI)
    if not os.environ.get("DISPLAY"):
        return True
    
    return False


def apply_mocks():
    """Apply mock patches for webdriver and webdriver_manager"""
    print("\n[MOCK] Applying webdriver mocks for headless environment...\n")
    
    # Patch Selenium webdriver
    import selenium.webdriver as webdriver
    webdriver.Edge = MockWebDriver
    webdriver.Chrome = MockWebDriver
    
    # Patch webdriver Service
    from selenium.webdriver.edge.service import Service as EdgeService
    from selenium.webdriver.chrome.service import Service as ChromeService
    EdgeService.__init__ = lambda self, *args, **kwargs: None
    ChromeService.__init__ = lambda self, *args, **kwargs: None
    
    # Patch webdriver_manager
    from webdriver_manager.microsoft import EdgeChromiumDriverManager
    from webdriver_manager.chrome import ChromeDriverManager
    EdgeChromiumDriverManager.install = MockEdgeChromiumDriverManager().install
    ChromeDriverManager.install = MockChromeDriverManager().install
    
    # Patch Select
    from selenium.webdriver.support.ui import Select
    Select.__init__ = lambda self, element: setattr(self, 'element', element)
    Select.select_by_value = MockSelect(None).select_by_value
    Select.select_by_visible_text = MockSelect(None).select_by_visible_text
    Select.select_by_index = MockSelect(None).select_by_index
    
    print("[MOCK] Webdriver mocks applied successfully\n")

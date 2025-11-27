"""
Page Object Model for Administration Prototype Page
Provides methods to interact with UI elements in the admin-prototype.html page
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time
from config import TestConfig

class AdministrationPage:
    """Page Object for Administration prototype page"""
    
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, TestConfig.IMPLICIT_WAIT)
    
    # ===== NAVIGATION SELECTORS =====
    NAV_USER_MANAGEMENT = (By.ID, "nav-users")
    NAV_ROLE_MANAGEMENT = (By.ID, "nav-roles")  
    NAV_SETTINGS = (By.ID, "nav-settings")
    
    # ===== USER MANAGEMENT SELECTORS =====
    # User table
    USER_TABLE = (By.ID, "userTable")
    USER_TABLE_ROWS = (By.CSS_SELECTOR, "#userTable tbody tr")
    USER_TABLE_HEADERS = (By.CSS_SELECTOR, "#userTable thead th")
    
    # User actions
    ADD_USER_BTN = (By.ID, "addUserBtn")
    BULK_UPLOAD_BTN = (By.ID, "bulkUploadBtn")
    DELETE_SELECTED_BTN = (By.ID, "deleteSelectedBtn")
    
    # User form fields
    USER_ID_INPUT = (By.ID, "userId")
    USER_NAME_INPUT = (By.ID, "userName")
    USER_EMAIL_INPUT = (By.ID, "userEmail")
    USER_DEPARTMENT_SELECT = (By.ID, "userDepartment")
    USER_ROLE_SELECT = (By.ID, "userRole")
    USER_STATUS_SELECT = (By.ID, "userStatus")
    USER_LOCATION_SELECT = (By.ID, "userLocation")
    
    # User form buttons
    SAVE_USER_BTN = (By.ID, "saveUserBtn")
    CANCEL_USER_BTN = (By.ID, "cancelUserBtn")
    
    # Search and filters
    USER_SEARCH_INPUT = (By.ID, "userSearch")
    DEPARTMENT_FILTER = (By.ID, "departmentFilter")
    ROLE_FILTER = (By.ID, "roleFilter")
    STATUS_FILTER = (By.ID, "statusFilter")
    LOCATION_FILTER = (By.ID, "locationFilter")
    CLEAR_FILTERS_BTN = (By.ID, "clearFiltersBtn")
    
    # ===== ROLE MANAGEMENT SELECTORS =====
    # Role table
    ROLE_TABLE = (By.ID, "roleTable")
    ROLE_TABLE_ROWS = (By.CSS_SELECTOR, "#roleTable tbody tr")
    
    # Role actions
    ADD_ROLE_BTN = (By.ID, "addRoleBtn")
    EDIT_ROLE_BTN = (By.CSS_SELECTOR, ".edit-role-btn")
    DELETE_ROLE_BTN = (By.CSS_SELECTOR, ".delete-role-btn")
    
    # Role form fields
    ROLE_NAME_INPUT = (By.ID, "roleName")
    ROLE_DESCRIPTION_INPUT = (By.ID, "roleDescription")
    PERMISSIONS_CHECKBOXES = (By.CSS_SELECTOR, "input[name='permissions']")
    
    # Role form buttons
    SAVE_ROLE_BTN = (By.ID, "saveRoleBtn")
    CANCEL_ROLE_BTN = (By.ID, "cancelRoleBtn")
    
    # ===== SETTINGS SELECTORS =====
    # Communication Settings
    EMAIL_NOTIFICATIONS_TOGGLE = (By.ID, "emailNotifications")
    SMS_NOTIFICATIONS_TOGGLE = (By.ID, "smsNotifications")
    PUSH_NOTIFICATIONS_TOGGLE = (By.ID, "pushNotifications")
    
    # Delay Settings
    PLANNED_OUTAGE_DELAY = (By.ID, "plannedOutageDelay")
    UNPLANNED_OUTAGE_DELAY = (By.ID, "unplannedOutageDelay")
    EMERGENCY_DELAY = (By.ID, "emergencyDelay")
    
    # Extreme Weather Mode
    EXTREME_WEATHER_TOGGLE = (By.ID, "extremeWeatherMode")
    WEATHER_THRESHOLD_TEMP = (By.ID, "weatherThresholdTemp")
    WEATHER_THRESHOLD_WIND = (By.ID, "weatherThresholdWind")
    
    # Settings buttons
    SAVE_SETTINGS_BTN = (By.ID, "saveSettingsBtn")
    RESET_SETTINGS_BTN = (By.ID, "resetSettingsBtn")
    
    # ===== COMMON SELECTORS =====
    SUCCESS_MESSAGE = (By.CSS_SELECTOR, ".alert-success")
    ERROR_MESSAGE = (By.CSS_SELECTOR, ".alert-danger")
    CONFIRMATION_MODAL = (By.ID, "confirmationModal")
    CONFIRM_YES_BTN = (By.ID, "confirmYes")
    CONFIRM_NO_BTN = (By.ID, "confirmNo")
    
    def slow_action(self, seconds=None):
        """Add delay between actions for visibility"""
        if TestConfig.SLOW_MOTION:
            delay = seconds if seconds else TestConfig.SLOW_MOTION_DELAY
            time.sleep(delay)
    
    # ===== NAVIGATION METHODS =====
    def click_user_management_nav(self):
        """Click on User Management navigation"""
        self.wait.until(EC.element_to_be_clickable(self.NAV_USER_MANAGEMENT)).click()
        self.slow_action()
        return self
    
    def click_role_management_nav(self):
        """Click on Role Management navigation"""
        self.wait.until(EC.element_to_be_clickable(self.NAV_ROLE_MANAGEMENT)).click()
        self.slow_action()
        return self
    
    def click_settings_nav(self):
        """Click on Settings navigation"""
        self.wait.until(EC.element_to_be_clickable(self.NAV_SETTINGS)).click()
        self.slow_action()
        return self
    
    # ===== USER MANAGEMENT METHODS =====
    def get_user_table_headers(self):
        """Get all table headers from user table"""
        headers = self.driver.find_elements(*self.USER_TABLE_HEADERS)
        return [header.text for header in headers]
    
    def get_user_table_rows_count(self):
        """Get number of rows in user table"""
        try:
            rows = self.driver.find_elements(*self.USER_TABLE_ROWS)
            return len(rows)
        except NoSuchElementException:
            return 0
    
    def get_user_table_data(self):
        """Get all user data from table"""
        users = []
        try:
            rows = self.driver.find_elements(*self.USER_TABLE_ROWS)
            for row in rows:
                cells = row.find_elements(By.TAG_NAME, "td")
                if len(cells) >= 6:  # Assuming 6+ columns
                    user_data = {
                        'id': cells[1].text,  # Skip checkbox column
                        'name': cells[2].text,
                        'email': cells[3].text,
                        'department': cells[4].text,
                        'role': cells[5].text,
                        'status': cells[6].text if len(cells) > 6 else ''
                    }
                    users.append(user_data)
        except NoSuchElementException:
            pass
        return users
    
    def click_add_user_button(self):
        """Click Add User button"""
        self.wait.until(EC.element_to_be_clickable(self.ADD_USER_BTN)).click()
        self.slow_action()
        return self
    
    def fill_user_form(self, user_id=None, name=None, email=None, department=None, role=None, status=None, location=None):
        """Fill user form fields"""
        if user_id:
            self.wait.until(EC.presence_of_element_located(self.USER_ID_INPUT)).clear()
            self.driver.find_element(*self.USER_ID_INPUT).send_keys(user_id)
            self.slow_action(0.2)
        
        if name:
            self.driver.find_element(*self.USER_NAME_INPUT).clear()
            self.driver.find_element(*self.USER_NAME_INPUT).send_keys(name)
            self.slow_action(0.2)
        
        if email:
            self.driver.find_element(*self.USER_EMAIL_INPUT).clear()
            self.driver.find_element(*self.USER_EMAIL_INPUT).send_keys(email)
            self.slow_action(0.2)
        
        if department:
            Select(self.driver.find_element(*self.USER_DEPARTMENT_SELECT)).select_by_visible_text(department)
            self.slow_action(0.2)
        
        if role:
            Select(self.driver.find_element(*self.USER_ROLE_SELECT)).select_by_visible_text(role)
            self.slow_action(0.2)
        
        if status:
            Select(self.driver.find_element(*self.USER_STATUS_SELECT)).select_by_visible_text(status)
            self.slow_action(0.2)
        
        if location:
            Select(self.driver.find_element(*self.USER_LOCATION_SELECT)).select_by_visible_text(location)
            self.slow_action(0.2)
        
        return self
    
    def save_user(self):
        """Click Save User button"""
        self.wait.until(EC.element_to_be_clickable(self.SAVE_USER_BTN)).click()
        self.slow_action()
        return self
    
    def cancel_user(self):
        """Click Cancel User button"""
        self.wait.until(EC.element_to_be_clickable(self.CANCEL_USER_BTN)).click()
        self.slow_action()
        return self
    
    def search_users(self, search_term):
        """Search users using search input"""
        search_input = self.wait.until(EC.presence_of_element_located(self.USER_SEARCH_INPUT))
        search_input.clear()
        search_input.send_keys(search_term)
        search_input.send_keys(Keys.ENTER)
        self.slow_action()
        return self
    
    def filter_users_by_department(self, department):
        """Filter users by department"""
        Select(self.driver.find_element(*self.DEPARTMENT_FILTER)).select_by_visible_text(department)
        self.slow_action()
        return self
    
    def filter_users_by_role(self, role):
        """Filter users by role"""
        Select(self.driver.find_element(*self.ROLE_FILTER)).select_by_visible_text(role)
        self.slow_action()
        return self
    
    def filter_users_by_status(self, status):
        """Filter users by status"""
        Select(self.driver.find_element(*self.STATUS_FILTER)).select_by_visible_text(status)
        self.slow_action()
        return self
    
    def clear_all_filters(self):
        """Click clear filters button"""
        self.wait.until(EC.element_to_be_clickable(self.CLEAR_FILTERS_BTN)).click()
        self.slow_action()
        return self
    
    def select_user_checkbox(self, user_index):
        """Select user checkbox by index (0-based)"""
        rows = self.driver.find_elements(*self.USER_TABLE_ROWS)
        if user_index < len(rows):
            checkbox = rows[user_index].find_element(By.CSS_SELECTOR, "input[type='checkbox']")
            checkbox.click()
            self.slow_action()
        return self
    
    def click_bulk_upload_button(self):
        """Click Bulk Upload button"""
        self.wait.until(EC.element_to_be_clickable(self.BULK_UPLOAD_BTN)).click()
        self.slow_action()
        return self
    
    def click_delete_selected_button(self):
        """Click Delete Selected button"""
        self.wait.until(EC.element_to_be_clickable(self.DELETE_SELECTED_BTN)).click()
        self.slow_action()
        return self
    
    # ===== ROLE MANAGEMENT METHODS =====
    def get_role_table_rows_count(self):
        """Get number of rows in role table"""
        try:
            rows = self.driver.find_elements(*self.ROLE_TABLE_ROWS)
            return len(rows)
        except NoSuchElementException:
            return 0
    
    def click_add_role_button(self):
        """Click Add Role button"""
        self.wait.until(EC.element_to_be_clickable(self.ADD_ROLE_BTN)).click()
        self.slow_action()
        return self
    
    def fill_role_form(self, role_name=None, description=None, permissions=None):
        """Fill role form fields"""
        if role_name:
            self.wait.until(EC.presence_of_element_located(self.ROLE_NAME_INPUT)).clear()
            self.driver.find_element(*self.ROLE_NAME_INPUT).send_keys(role_name)
            self.slow_action(0.2)
        
        if description:
            self.driver.find_element(*self.ROLE_DESCRIPTION_INPUT).clear()
            self.driver.find_element(*self.ROLE_DESCRIPTION_INPUT).send_keys(description)
            self.slow_action(0.2)
        
        if permissions:
            checkboxes = self.driver.find_elements(*self.PERMISSIONS_CHECKBOXES)
            for checkbox in checkboxes:
                permission_name = checkbox.get_attribute('value')
                if permission_name in permissions:
                    if not checkbox.is_selected():
                        checkbox.click()
                        self.slow_action(0.1)
                else:
                    if checkbox.is_selected():
                        checkbox.click()
                        self.slow_action(0.1)
        
        return self
    
    def save_role(self):
        """Click Save Role button"""
        self.wait.until(EC.element_to_be_clickable(self.SAVE_ROLE_BTN)).click()
        self.slow_action()
        return self
    
    # ===== SETTINGS METHODS =====
    def toggle_email_notifications(self, enable=True):
        """Toggle email notifications setting"""
        toggle = self.wait.until(EC.element_to_be_clickable(self.EMAIL_NOTIFICATIONS_TOGGLE))
        if toggle.is_selected() != enable:
            toggle.click()
            self.slow_action()
        return self
    
    def toggle_sms_notifications(self, enable=True):
        """Toggle SMS notifications setting"""
        toggle = self.wait.until(EC.element_to_be_clickable(self.SMS_NOTIFICATIONS_TOGGLE))
        if toggle.is_selected() != enable:
            toggle.click()
            self.slow_action()
        return self
    
    def set_planned_outage_delay(self, minutes):
        """Set planned outage delay"""
        delay_input = self.wait.until(EC.presence_of_element_located(self.PLANNED_OUTAGE_DELAY))
        delay_input.clear()
        delay_input.send_keys(str(minutes))
        self.slow_action()
        return self
    
    def toggle_extreme_weather_mode(self, enable=True):
        """Toggle extreme weather mode"""
        toggle = self.wait.until(EC.element_to_be_clickable(self.EXTREME_WEATHER_TOGGLE))
        if toggle.is_selected() != enable:
            toggle.click()
            self.slow_action()
        return self
    
    def save_settings(self):
        """Click Save Settings button"""
        self.wait.until(EC.element_to_be_clickable(self.SAVE_SETTINGS_BTN)).click()
        self.slow_action()
        return self
    
    def reset_settings(self):
        """Click Reset Settings button"""
        self.wait.until(EC.element_to_be_clickable(self.RESET_SETTINGS_BTN)).click()
        self.slow_action()
        return self
    
    # ===== COMMON METHODS =====
    def wait_for_success_message(self, timeout=10):
        """Wait for success message to appear"""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located(self.SUCCESS_MESSAGE)
            )
            return element.text
        except TimeoutException:
            return None
    
    def wait_for_error_message(self, timeout=10):
        """Wait for error message to appear"""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located(self.ERROR_MESSAGE)
            )
            return element.text
        except TimeoutException:
            return None
    
    def confirm_action(self, confirm=True):
        """Handle confirmation modal"""
        try:
            self.wait.until(EC.presence_of_element_located(self.CONFIRMATION_MODAL))
            if confirm:
                self.wait.until(EC.element_to_be_clickable(self.CONFIRM_YES_BTN)).click()
            else:
                self.wait.until(EC.element_to_be_clickable(self.CONFIRM_NO_BTN)).click()
            self.slow_action()
        except TimeoutException:
            pass  # No confirmation modal appeared
        return self
    
    def is_element_present(self, locator, timeout=5):
        """Check if element is present on page"""
        try:
            WebDriverWait(self.driver, timeout).until(EC.presence_of_element_located(locator))
            return True
        except TimeoutException:
            return False
    
    def is_element_visible(self, locator, timeout=5):
        """Check if element is visible on page"""
        try:
            WebDriverWait(self.driver, timeout).until(EC.visibility_of_element_located(locator))
            return True
        except TimeoutException:
            return False
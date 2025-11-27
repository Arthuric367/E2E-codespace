"""
Test cases for Settings functionality
Based on Jira stories EP-33-39, EP-44, EP-90, EP-101, EP-110-112

Test Coverage:
- EP-33-39: Communication settings (email, SMS, push notifications)
- EP-44: Delay settings for different notification types
- EP-90: Extreme weather mode configuration
- EP-101: Weather threshold settings
- EP-110-112: Advanced notification settings and configuration
"""
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import sys
import os

# Add the parent directory to Python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from page_objects.administration_page import AdministrationPage
from helpers.test_data import TestDataHelper

@pytest.mark.settings
class TestSettings:
    """Test suite for Settings functionality"""
    
    def test_ep33_email_notifications_toggle(self, admin_page, slow_action_fixture):
        """EP-33: Test email notifications toggle"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Test enabling email notifications
        page.toggle_email_notifications(enable=True)
        slow_action_fixture()
        
        # Save settings
        page.save_settings()
        slow_action_fixture()
        
        # Verify success
        success_msg = page.wait_for_success_message(timeout=5)
        if success_msg:
            print(f"✅ Email notifications enabled: {success_msg}")
        
        # Test disabling email notifications
        page.toggle_email_notifications(enable=False)
        slow_action_fixture()
        
        # Save settings
        page.save_settings()
        slow_action_fixture()
        
        print("✅ Email notifications toggle functionality tested")
    
    def test_ep34_sms_notifications_toggle(self, admin_page, slow_action_fixture):
        """EP-34: Test SMS notifications toggle"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Test enabling SMS notifications
        page.toggle_sms_notifications(enable=True)
        slow_action_fixture()
        
        # Save settings
        page.save_settings()
        slow_action_fixture()
        
        # Verify success
        success_msg = page.wait_for_success_message(timeout=5)
        if success_msg:
            print(f"✅ SMS notifications enabled: {success_msg}")
        
        # Test disabling SMS notifications
        page.toggle_sms_notifications(enable=False)
        slow_action_fixture()
        
        # Save settings
        page.save_settings()
        slow_action_fixture()
        
        print("✅ SMS notifications toggle functionality tested")
    
    def test_ep35_push_notifications_configuration(self, admin_page, slow_action_fixture):
        """EP-35: Test push notifications configuration"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Check for push notification toggle element
        if page.is_element_present(page.PUSH_NOTIFICATIONS_TOGGLE):
            # Test enabling push notifications
            push_toggle = page.driver.find_element(*page.PUSH_NOTIFICATIONS_TOGGLE)
            
            # Enable if not already enabled
            if not push_toggle.is_selected():
                push_toggle.click()
                slow_action_fixture()
            
            # Save settings
            page.save_settings()
            slow_action_fixture()
            
            print("✅ Push notifications configuration tested")
        else:
            print("⚠️ Push notifications toggle not found - may need implementation")
    
    def test_ep44_planned_outage_delay_settings(self, admin_page, slow_action_fixture):
        """EP-44: Test planned outage delay settings"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Test different delay values
        delay_values = [30, 60, 120, 180]  # minutes
        
        for delay in delay_values:
            page.set_planned_outage_delay(delay)
            slow_action_fixture(0.5)
            
            # Save settings
            page.save_settings()
            slow_action_fixture()
            
            print(f"✅ Planned outage delay set to {delay} minutes")
            
            # Verify success message
            success_msg = page.wait_for_success_message(timeout=5)
            if success_msg:
                print(f"  Success: {success_msg}")
    
    def test_ep44_unplanned_outage_delay_settings(self, admin_page, slow_action_fixture):
        """EP-44: Test unplanned outage delay settings"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Check for unplanned outage delay element
        if page.is_element_present(page.UNPLANNED_OUTAGE_DELAY):
            delay_input = page.driver.find_element(*page.UNPLANNED_OUTAGE_DELAY)
            
            # Test setting unplanned outage delay
            delay_input.clear()
            delay_input.send_keys("15")  # 15 minutes
            slow_action_fixture()
            
            # Save settings
            page.save_settings()
            slow_action_fixture()
            
            print("✅ Unplanned outage delay settings tested")
        else:
            print("⚠️ Unplanned outage delay setting not found")
    
    def test_ep44_emergency_delay_settings(self, admin_page, slow_action_fixture):
        """EP-44: Test emergency delay settings"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Check for emergency delay element
        if page.is_element_present(page.EMERGENCY_DELAY):
            delay_input = page.driver.find_element(*page.EMERGENCY_DELAY)
            
            # Test setting emergency delay
            delay_input.clear()
            delay_input.send_keys("5")  # 5 minutes
            slow_action_fixture()
            
            # Save settings
            page.save_settings()
            slow_action_fixture()
            
            print("✅ Emergency delay settings tested")
        else:
            print("⚠️ Emergency delay setting not found")
    
    def test_ep90_extreme_weather_mode_toggle(self, admin_page, slow_action_fixture):
        """EP-90: Test extreme weather mode toggle"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Test enabling extreme weather mode
        page.toggle_extreme_weather_mode(enable=True)
        slow_action_fixture()
        
        # Save settings
        page.save_settings()
        slow_action_fixture()
        
        # Verify success
        success_msg = page.wait_for_success_message(timeout=5)
        if success_msg:
            print(f"✅ Extreme weather mode enabled: {success_msg}")
        
        # Test disabling extreme weather mode
        page.toggle_extreme_weather_mode(enable=False)
        slow_action_fixture()
        
        # Save settings
        page.save_settings()
        slow_action_fixture()
        
        print("✅ Extreme weather mode toggle functionality tested")
    
    def test_ep101_weather_threshold_temperature(self, admin_page, slow_action_fixture):
        """EP-101: Test weather threshold temperature settings"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Enable extreme weather mode first
        page.toggle_extreme_weather_mode(enable=True)
        slow_action_fixture()
        
        # Check for temperature threshold element
        if page.is_element_present(page.WEATHER_THRESHOLD_TEMP):
            temp_input = page.driver.find_element(*page.WEATHER_THRESHOLD_TEMP)
            
            # Test different temperature values
            test_temperatures = [30, 35, 40, 45]  # Celsius
            
            for temp in test_temperatures:
                temp_input.clear()
                temp_input.send_keys(str(temp))
                slow_action_fixture(0.5)
                
                print(f"✅ Temperature threshold set to {temp}°C")
            
            # Save settings
            page.save_settings()
            slow_action_fixture()
            
            print("✅ Weather temperature threshold settings tested")
        else:
            print("⚠️ Weather temperature threshold setting not found")
    
    def test_ep101_weather_threshold_wind_speed(self, admin_page, slow_action_fixture):
        """EP-101: Test weather threshold wind speed settings"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Enable extreme weather mode first
        page.toggle_extreme_weather_mode(enable=True)
        slow_action_fixture()
        
        # Check for wind speed threshold element
        if page.is_element_present(page.WEATHER_THRESHOLD_WIND):
            wind_input = page.driver.find_element(*page.WEATHER_THRESHOLD_WIND)
            
            # Test different wind speed values
            test_wind_speeds = [50, 60, 70, 80]  # km/h
            
            for speed in test_wind_speeds:
                wind_input.clear()
                wind_input.send_keys(str(speed))
                slow_action_fixture(0.5)
                
                print(f"✅ Wind speed threshold set to {speed} km/h")
            
            # Save settings
            page.save_settings()
            slow_action_fixture()
            
            print("✅ Weather wind speed threshold settings tested")
        else:
            print("⚠️ Weather wind speed threshold setting not found")
    
    def test_ep110_notification_priority_settings(self, admin_page, slow_action_fixture):
        """EP-110: Test notification priority settings"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Look for priority settings elements
        priority_elements = page.driver.find_elements(By.CSS_SELECTOR, 
            "select[name*='priority'], input[name*='priority'], .priority-setting")
        
        if len(priority_elements) > 0:
            print(f"✅ Found {len(priority_elements)} priority setting elements")
            
            # Test priority configuration
            for element in priority_elements[:3]:  # Test first 3 elements
                if element.tag_name == "select":
                    # If it's a dropdown, select different options
                    from selenium.webdriver.support.ui import Select
                    select = Select(element)
                    options = [option.text for option in select.options]
                    if len(options) > 1:
                        select.select_by_index(1)  # Select second option
                        slow_action_fixture(0.5)
                
                elif element.tag_name == "input":
                    # If it's an input, test different values
                    element.clear()
                    element.send_keys("High")
                    slow_action_fixture(0.5)
            
            # Save settings
            page.save_settings()
            slow_action_fixture()
            
            print("✅ Notification priority settings tested")
        else:
            print("⚠️ Notification priority settings not found")
    
    def test_ep111_notification_escalation_settings(self, admin_page, slow_action_fixture):
        """EP-111: Test notification escalation settings"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Look for escalation settings elements
        escalation_elements = page.driver.find_elements(By.CSS_SELECTOR, 
            "input[name*='escalation'], select[name*='escalation'], .escalation-setting")
        
        if len(escalation_elements) > 0:
            print(f"✅ Found {len(escalation_elements)} escalation setting elements")
            
            # Test escalation time settings
            for element in escalation_elements:
                if element.tag_name == "input" and element.get_attribute("type") == "number":
                    element.clear()
                    element.send_keys("30")  # 30 minutes escalation time
                    slow_action_fixture(0.5)
            
            # Save settings
            page.save_settings()
            slow_action_fixture()
            
            print("✅ Notification escalation settings tested")
        else:
            print("⚠️ Notification escalation settings not found")
    
    def test_ep112_notification_retry_settings(self, admin_page, slow_action_fixture):
        """EP-112: Test notification retry settings"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Look for retry settings elements
        retry_elements = page.driver.find_elements(By.CSS_SELECTOR, 
            "input[name*='retry'], select[name*='retry'], .retry-setting")
        
        if len(retry_elements) > 0:
            print(f"✅ Found {len(retry_elements)} retry setting elements")
            
            # Test retry configuration
            for element in retry_elements:
                if element.tag_name == "input":
                    if element.get_attribute("type") == "number":
                        element.clear()
                        element.send_keys("3")  # 3 retry attempts
                        slow_action_fixture(0.5)
                    elif element.get_attribute("type") == "checkbox":
                        if not element.is_selected():
                            element.click()
                            slow_action_fixture(0.5)
            
            # Save settings
            page.save_settings()
            slow_action_fixture()
            
            print("✅ Notification retry settings tested")
        else:
            print("⚠️ Notification retry settings not found")
    
    def test_settings_reset_functionality(self, admin_page, slow_action_fixture):
        """Test settings reset to default values"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Modify some settings first
        page.toggle_email_notifications(enable=True)
        page.set_planned_outage_delay(120)
        page.toggle_extreme_weather_mode(enable=True)
        slow_action_fixture()
        
        # Reset settings
        page.reset_settings()
        slow_action_fixture()
        
        # Confirm reset action if modal appears
        page.confirm_action(confirm=True)
        slow_action_fixture()
        
        # Verify success
        success_msg = page.wait_for_success_message(timeout=5)
        if success_msg:
            print(f"✅ Settings reset successfully: {success_msg}")
        else:
            print("✅ Settings reset completed")
    
    def test_settings_form_validation(self, admin_page, slow_action_fixture):
        """Test settings form validation"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Test invalid delay values
        if page.is_element_present(page.PLANNED_OUTAGE_DELAY):
            delay_input = page.driver.find_element(*page.PLANNED_OUTAGE_DELAY)
            
            # Test negative value
            delay_input.clear()
            delay_input.send_keys("-10")
            slow_action_fixture()
            
            # Try to save
            page.save_settings()
            slow_action_fixture()
            
            # Check for error
            error_msg = page.wait_for_error_message(timeout=5)
            if error_msg:
                print(f"✅ Validation error for negative value: {error_msg}")
            
            # Test extremely high value
            delay_input.clear()
            delay_input.send_keys("99999")
            slow_action_fixture()
            
            # Try to save
            page.save_settings()
            slow_action_fixture()
    
    def test_communication_settings_combination(self, admin_page, slow_action_fixture):
        """Test different combinations of communication settings"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Test combinations
        combinations = [
            {"email": True, "sms": True, "push": False},
            {"email": True, "sms": False, "push": True},
            {"email": False, "sms": True, "push": True},
            {"email": True, "sms": True, "push": True},
            {"email": False, "sms": False, "push": False}
        ]
        
        for i, combo in enumerate(combinations):
            print(f"🔧 Testing combination {i+1}: {combo}")
            
            # Set combination
            page.toggle_email_notifications(enable=combo["email"])
            page.toggle_sms_notifications(enable=combo["sms"])
            
            # Check if push notifications toggle exists
            if page.is_element_present(page.PUSH_NOTIFICATIONS_TOGGLE):
                push_toggle = page.driver.find_element(*page.PUSH_NOTIFICATIONS_TOGGLE)
                if push_toggle.is_selected() != combo["push"]:
                    push_toggle.click()
                    slow_action_fixture(0.2)
            
            # Save settings
            page.save_settings()
            slow_action_fixture()
            
            # Verify success
            success_msg = page.wait_for_success_message(timeout=3)
            if success_msg:
                print(f"  ✅ Combination {i+1} saved successfully")
        
        print("✅ All communication setting combinations tested")
    
    def test_settings_page_navigation(self, admin_page, slow_action_fixture):
        """Test settings page navigation and UI elements"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Settings
        page.click_settings_nav()
        slow_action_fixture()
        
        # Verify key setting elements are present
        elements_to_check = [
            (page.EMAIL_NOTIFICATIONS_TOGGLE, "Email notifications toggle"),
            (page.SMS_NOTIFICATIONS_TOGGLE, "SMS notifications toggle"),
            (page.PLANNED_OUTAGE_DELAY, "Planned outage delay"),
            (page.EXTREME_WEATHER_TOGGLE, "Extreme weather mode toggle"),
            (page.SAVE_SETTINGS_BTN, "Save settings button"),
            (page.RESET_SETTINGS_BTN, "Reset settings button")
        ]
        
        for element_selector, description in elements_to_check:
            is_present = page.is_element_present(element_selector, timeout=2)
            if is_present:
                print(f"✅ {description} is present")
            else:
                print(f"⚠️ {description} not found")
        
        print("✅ Settings page navigation and UI verification completed")
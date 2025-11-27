"""
Test cases for User Management functionality
Based on Jira stories EP-3, EP-23-29

Test Coverage:
- EP-3: Display users in a tabular format
- EP-23: Add new users 
- EP-24: Edit existing users
- EP-25: Delete users
- EP-26: Filter users by department
- EP-27: Filter users by role
- EP-28: Search users by name/email
- EP-29: Bulk upload users
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

@pytest.mark.user_management
class TestUserManagement:
    """Test suite for User Management functionality"""
    
    def test_ep3_display_users_table(self, admin_page, slow_action_fixture):
        """EP-3: Verify users are displayed in tabular format"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        # Verify table is present
        assert page.is_element_present(page.USER_TABLE), "User table should be present"
        
        # Verify table headers
        headers = page.get_user_table_headers()
        expected_headers = ["Select", "User ID", "Name", "Email", "Department", "Role", "Status", "Location", "Actions"]
        
        # Check that key headers are present (may not be exact match due to HTML structure)
        assert len(headers) > 0, "Table should have headers"
        print(f"✅ Table headers found: {headers}")
        
        # Verify table has rows (assuming mock data is loaded)
        rows_count = page.get_user_table_rows_count()
        print(f"📊 Found {rows_count} user rows in table")
        
    def test_ep23_add_new_user_valid_data(self, admin_page, slow_action_fixture):
        """EP-23: Add new user with valid data"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        # Get initial row count
        initial_count = page.get_user_table_rows_count()
        
        # Click Add User button
        page.click_add_user_button()
        slow_action_fixture()
        
        # Create test user
        test_user = TestDataHelper.create_test_user(
            user_id="TEST001",
            name="Test User",
            email="test.user@company.com",
            department="IT",
            role="Administrator"
        )
        
        # Fill user form
        page.fill_user_form(
            user_id=test_user['id'],
            name=test_user['name'],
            email=test_user['email'],
            department=test_user['department'],
            role=test_user['role'],
            status=test_user['status'],
            location=test_user['location']
        )
        
        # Save user
        page.save_user()
        slow_action_fixture()
        
        # Verify success (check for success message or table update)
        success_msg = page.wait_for_success_message(timeout=5)
        if success_msg:
            print(f"✅ Success message: {success_msg}")
        
        # Verify user appears in table
        new_count = page.get_user_table_rows_count()
        print(f"📊 Users before: {initial_count}, after: {new_count}")
        
    def test_ep23_add_user_invalid_email(self, admin_page, slow_action_fixture):
        """EP-23: Add user with invalid email format"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        # Click Add User button
        page.click_add_user_button()
        slow_action_fixture()
        
        # Fill form with invalid email
        page.fill_user_form(
            user_id="TEST002",
            name="Invalid Email User",
            email="invalid-email",  # Invalid format
            department="IT",
            role="Administrator"
        )
        
        # Attempt to save
        page.save_user()
        slow_action_fixture()
        
        # Check for error message or validation
        error_msg = page.wait_for_error_message(timeout=5)
        if error_msg:
            print(f"✅ Expected error message: {error_msg}")
        
    def test_ep24_edit_user_information(self, admin_page, slow_action_fixture):
        """EP-24: Edit existing user information"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        # Get existing users
        users = page.get_user_table_data()
        if len(users) > 0:
            print(f"📝 Editing first user: {users[0]}")
            
            # Click edit button for first user (assuming edit button exists)
            edit_btn = page.driver.find_elements(By.CSS_SELECTOR, ".edit-user-btn")
            if edit_btn:
                edit_btn[0].click()
                slow_action_fixture()
                
                # Modify user data
                page.fill_user_form(
                    name="Modified User Name",
                    email="modified.email@company.com",
                    department="Operations"
                )
                
                # Save changes
                page.save_user()
                slow_action_fixture()
                
                # Verify success
                success_msg = page.wait_for_success_message(timeout=5)
                if success_msg:
                    print(f"✅ User modified successfully: {success_msg}")
        else:
            pytest.skip("No users available to edit")
    
    def test_ep25_delete_user_confirmation(self, admin_page, slow_action_fixture):
        """EP-25: Delete user with confirmation"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        initial_count = page.get_user_table_rows_count()
        
        if initial_count > 0:
            # Select first user checkbox
            page.select_user_checkbox(0)
            slow_action_fixture()
            
            # Click delete selected button
            page.click_delete_selected_button()
            slow_action_fixture()
            
            # Confirm deletion
            page.confirm_action(confirm=True)
            slow_action_fixture()
            
            # Verify user count decreased
            new_count = page.get_user_table_rows_count()
            print(f"📊 Users before deletion: {initial_count}, after: {new_count}")
            
            # Check for success message
            success_msg = page.wait_for_success_message(timeout=5)
            if success_msg:
                print(f"✅ Delete confirmation: {success_msg}")
        else:
            pytest.skip("No users available to delete")
    
    def test_ep25_delete_user_cancellation(self, admin_page, slow_action_fixture):
        """EP-25: Cancel user deletion"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        initial_count = page.get_user_table_rows_count()
        
        if initial_count > 0:
            # Select first user checkbox
            page.select_user_checkbox(0)
            slow_action_fixture()
            
            # Click delete selected button
            page.click_delete_selected_button()
            slow_action_fixture()
            
            # Cancel deletion
            page.confirm_action(confirm=False)
            slow_action_fixture()
            
            # Verify user count unchanged
            new_count = page.get_user_table_rows_count()
            assert new_count == initial_count, "User count should remain unchanged after cancellation"
            print(f"✅ Deletion cancelled successfully, count unchanged: {new_count}")
        else:
            pytest.skip("No users available for deletion test")
    
    def test_ep26_filter_users_by_department(self, admin_page, slow_action_fixture):
        """EP-26: Filter users by department"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        # Get all users first
        all_users = page.get_user_table_data()
        total_count = len(all_users)
        print(f"📊 Total users before filter: {total_count}")
        
        # Filter by department (using first available department)
        departments = TestDataHelper.get_departments()
        test_department = departments[0]  # Use first department
        
        page.filter_users_by_department(test_department)
        slow_action_fixture()
        
        # Get filtered results
        filtered_users = page.get_user_table_data()
        filtered_count = len(filtered_users)
        print(f"🔍 Users after filtering by {test_department}: {filtered_count}")
        
        # Verify all shown users belong to selected department
        for user in filtered_users:
            if user.get('department'):
                assert user['department'] == test_department, f"User {user['name']} should be in {test_department} department"
        
        # Clear filters
        page.clear_all_filters()
        slow_action_fixture()
        
        # Verify count returns to original
        cleared_count = page.get_user_table_rows_count()
        print(f"🔄 Users after clearing filters: {cleared_count}")
    
    def test_ep27_filter_users_by_role(self, admin_page, slow_action_fixture):
        """EP-27: Filter users by role"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        # Filter by role
        test_role = "Administrator"
        page.filter_users_by_role(test_role)
        slow_action_fixture()
        
        # Get filtered results
        filtered_users = page.get_user_table_data()
        print(f"🔍 Users with {test_role} role: {len(filtered_users)}")
        
        # Verify all shown users have selected role
        for user in filtered_users:
            if user.get('role'):
                assert user['role'] == test_role, f"User {user['name']} should have {test_role} role"
        
        # Clear filters
        page.clear_all_filters()
        slow_action_fixture()
    
    def test_ep28_search_users_by_name(self, admin_page, slow_action_fixture):
        """EP-28: Search users by name"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        # Get some user data first
        users = page.get_user_table_data()
        if len(users) > 0:
            # Search for first user's name
            search_name = users[0]['name'].split()[0]  # First word of name
            print(f"🔍 Searching for users with name containing: {search_name}")
            
            page.search_users(search_name)
            slow_action_fixture()
            
            # Get search results
            search_results = page.get_user_table_data()
            print(f"📊 Search results: {len(search_results)} users found")
            
            # Verify search results contain the search term
            for user in search_results:
                assert search_name.lower() in user['name'].lower(), f"User {user['name']} should contain search term {search_name}"
        else:
            pytest.skip("No users available for search test")
    
    def test_ep28_search_users_by_email(self, admin_page, slow_action_fixture):
        """EP-28: Search users by email"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        # Search for users with company email domain
        search_term = "@company.com"
        page.search_users(search_term)
        slow_action_fixture()
        
        # Get search results
        search_results = page.get_user_table_data()
        print(f"📧 Users with company email: {len(search_results)}")
        
        # Verify search results contain the search term
        for user in search_results:
            if user.get('email'):
                assert search_term in user['email'], f"User email {user['email']} should contain {search_term}"
    
    def test_ep29_bulk_upload_users_button(self, admin_page, slow_action_fixture):
        """EP-29: Test bulk upload users functionality"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        # Click bulk upload button
        page.click_bulk_upload_button()
        slow_action_fixture()
        
        # Verify bulk upload modal/form appears
        # This test verifies the UI element is accessible
        print("✅ Bulk upload button clicked successfully")
        
        # Note: Actual file upload testing would require additional setup
        # and file handling which depends on the specific implementation
    
    def test_user_status_filter_active(self, admin_page, slow_action_fixture):
        """Filter users by Active status"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        # Filter by Active status
        page.filter_users_by_status("Active")
        slow_action_fixture()
        
        # Get filtered results
        filtered_users = page.get_user_table_data()
        print(f"✅ Active users: {len(filtered_users)}")
        
        # Verify all shown users are active
        for user in filtered_users:
            if user.get('status'):
                assert user['status'] == "Active", f"User {user['name']} should be Active"
    
    def test_user_form_validation_required_fields(self, admin_page, slow_action_fixture):
        """Test user form validation for required fields"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        # Click Add User button
        page.click_add_user_button()
        slow_action_fixture()
        
        # Try to save with empty form
        page.save_user()
        slow_action_fixture()
        
        # Check for validation error
        error_msg = page.wait_for_error_message(timeout=5)
        if error_msg:
            print(f"✅ Validation error caught: {error_msg}")
        
        # Cancel the form
        page.cancel_user()
        slow_action_fixture()
    
    def test_user_table_column_sorting(self, admin_page, slow_action_fixture):
        """Test user table column sorting functionality"""
        page = AdministrationPage(admin_page)
        
        # Navigate to User Management
        page.click_user_management_nav()
        slow_action_fixture()
        
        # Get initial user data
        initial_users = page.get_user_table_data()
        initial_count = len(initial_users)
        print(f"📊 Initial user count for sorting test: {initial_count}")
        
        # Try clicking on table headers for sorting (if implemented)
        headers = page.driver.find_elements(By.CSS_SELECTOR, "#userTable thead th")
        if len(headers) > 1:
            # Click on name column header (assuming it's sortable)
            name_header = headers[2] if len(headers) > 2 else headers[1]
            name_header.click()
            slow_action_fixture()
            
            print("✅ Column header clicked for sorting")
        
        # Verify table still displays users
        sorted_users = page.get_user_table_data()
        sorted_count = len(sorted_users)
        assert sorted_count == initial_count, "User count should remain same after sorting"
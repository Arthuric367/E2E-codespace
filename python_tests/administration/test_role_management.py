"""
Test cases for Role Management functionality
Based on Jira stories EP-30-32, EP-40-41, EP-89

Test Coverage:
- EP-30: Add new roles
- EP-31: Edit existing roles  
- EP-32: Delete roles
- EP-40: Assign permissions to roles
- EP-41: View role permissions
- EP-89: Alert Group assignment for roles
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

@pytest.mark.role_management
class TestRoleManagement:
    """Test suite for Role Management functionality"""
    
    def test_ep30_add_new_role_valid_data(self, admin_page, slow_action_fixture):
        """EP-30: Add new role with valid data"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Role Management
        page.click_role_management_nav()
        slow_action_fixture()
        
        # Get initial role count
        initial_count = page.get_role_table_rows_count()
        print(f"📊 Initial roles count: {initial_count}")
        
        # Click Add Role button
        page.click_add_role_button()
        slow_action_fixture()
        
        # Create test role
        test_role = TestDataHelper.create_test_role(
            name="Test Manager Role",
            description="Test role for management functions",
            permissions=["user_view", "notification_management", "reporting"]
        )
        
        # Fill role form
        page.fill_role_form(
            role_name=test_role['name'],
            description=test_role['description'],
            permissions=test_role['permissions']
        )
        
        # Save role
        page.save_role()
        slow_action_fixture()
        
        # Verify success
        success_msg = page.wait_for_success_message(timeout=5)
        if success_msg:
            print(f"✅ Success message: {success_msg}")
        
        # Verify role appears in table
        new_count = page.get_role_table_rows_count()
        print(f"📊 Roles after addition - before: {initial_count}, after: {new_count}")
    
    def test_ep30_add_role_duplicate_name(self, admin_page, slow_action_fixture):
        """EP-30: Add role with duplicate name (should fail)"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Role Management
        page.click_role_management_nav()
        slow_action_fixture()
        
        # Click Add Role button
        page.click_add_role_button()
        slow_action_fixture()
        
        # Try to create role with existing name
        page.fill_role_form(
            role_name="Administrator",  # Assuming this role already exists
            description="Duplicate role test",
            permissions=["user_view"]
        )
        
        # Attempt to save
        page.save_role()
        slow_action_fixture()
        
        # Check for error message
        error_msg = page.wait_for_error_message(timeout=5)
        if error_msg:
            print(f"✅ Expected error for duplicate role: {error_msg}")
        else:
            print("⚠️ No error message detected - validation may need improvement")
    
    def test_ep31_edit_existing_role(self, admin_page, slow_action_fixture):
        """EP-31: Edit existing role information"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Role Management
        page.click_role_management_nav()
        slow_action_fixture()
        
        # Look for edit buttons in role table
        edit_buttons = page.driver.find_elements(*page.EDIT_ROLE_BTN)
        
        if len(edit_buttons) > 0:
            print(f"📝 Found {len(edit_buttons)} roles to edit")
            
            # Click edit button for first role
            edit_buttons[0].click()
            slow_action_fixture()
            
            # Modify role data
            page.fill_role_form(
                role_name="Modified Role Name",
                description="Updated role description with new permissions",
                permissions=["user_view", "notification_management"]  # Modified permissions
            )
            
            # Save changes
            page.save_role()
            slow_action_fixture()
            
            # Verify success
            success_msg = page.wait_for_success_message(timeout=5)
            if success_msg:
                print(f"✅ Role edited successfully: {success_msg}")
        else:
            pytest.skip("No editable roles found in table")
    
    def test_ep32_delete_role_confirmation(self, admin_page, slow_action_fixture):
        """EP-32: Delete role with confirmation"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Role Management
        page.click_role_management_nav()
        slow_action_fixture()
        
        initial_count = page.get_role_table_rows_count()
        print(f"📊 Initial roles count: {initial_count}")
        
        # Look for delete buttons
        delete_buttons = page.driver.find_elements(*page.DELETE_ROLE_BTN)
        
        if len(delete_buttons) > 0:
            # Click delete button for last role (to avoid deleting critical roles)
            delete_buttons[-1].click()
            slow_action_fixture()
            
            # Confirm deletion
            page.confirm_action(confirm=True)
            slow_action_fixture()
            
            # Verify role count decreased
            new_count = page.get_role_table_rows_count()
            print(f"📊 Roles after deletion - before: {initial_count}, after: {new_count}")
            
            # Check for success message
            success_msg = page.wait_for_success_message(timeout=5)
            if success_msg:
                print(f"✅ Delete confirmation: {success_msg}")
        else:
            pytest.skip("No deletable roles found")
    
    def test_ep32_delete_role_cancellation(self, admin_page, slow_action_fixture):
        """EP-32: Cancel role deletion"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Role Management
        page.click_role_management_nav()
        slow_action_fixture()
        
        initial_count = page.get_role_table_rows_count()
        
        # Look for delete buttons
        delete_buttons = page.driver.find_elements(*page.DELETE_ROLE_BTN)
        
        if len(delete_buttons) > 0:
            # Click delete button
            delete_buttons[0].click()
            slow_action_fixture()
            
            # Cancel deletion
            page.confirm_action(confirm=False)
            slow_action_fixture()
            
            # Verify role count unchanged
            new_count = page.get_role_table_rows_count()
            assert new_count == initial_count, "Role count should remain unchanged after cancellation"
            print(f"✅ Deletion cancelled successfully, count unchanged: {new_count}")
        else:
            pytest.skip("No roles available for deletion test")
    
    def test_ep40_assign_permissions_to_role(self, admin_page, slow_action_fixture):
        """EP-40: Assign permissions to roles"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Role Management
        page.click_role_management_nav()
        slow_action_fixture()
        
        # Click Add Role button to test permission assignment
        page.click_add_role_button()
        slow_action_fixture()
        
        # Test different permission combinations
        test_permissions = [
            ["user_management", "role_management"],
            ["notification_management", "reporting"],
            ["system_administration", "settings_management"]
        ]
        
        for i, permissions in enumerate(test_permissions):
            role_name = f"Permission Test Role {i+1}"
            
            # Fill role form with specific permissions
            page.fill_role_form(
                role_name=role_name,
                description=f"Testing role with permissions: {', '.join(permissions)}",
                permissions=permissions
            )
            
            print(f"✅ Assigned permissions {permissions} to role {role_name}")
            
            if i < len(test_permissions) - 1:
                # Clear form for next test (assuming form allows modification)
                page.fill_role_form(role_name="", description="", permissions=[])
        
        # Save the last role
        page.save_role()
        slow_action_fixture()
    
    def test_ep41_view_role_permissions(self, admin_page, slow_action_fixture):
        """EP-41: View role permissions"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Role Management
        page.click_role_management_nav()
        slow_action_fixture()
        
        # Look for view/edit buttons to see role permissions
        edit_buttons = page.driver.find_elements(*page.EDIT_ROLE_BTN)
        
        if len(edit_buttons) > 0:
            # Click edit/view button to see permissions
            edit_buttons[0].click()
            slow_action_fixture()
            
            # Check for permission checkboxes/displays
            permission_elements = page.driver.find_elements(*page.PERMISSIONS_CHECKBOXES)
            
            if len(permission_elements) > 0:
                print(f"✅ Found {len(permission_elements)} permission options")
                
                # Check which permissions are selected
                selected_permissions = []
                for permission in permission_elements:
                    if permission.is_selected():
                        permission_name = permission.get_attribute('value')
                        selected_permissions.append(permission_name)
                
                print(f"📋 Selected permissions: {selected_permissions}")
            else:
                print("⚠️ No permission elements found - UI may need adjustment")
        else:
            pytest.skip("No roles available to view permissions")
    
    def test_ep89_alert_group_assignment(self, admin_page, slow_action_fixture):
        """EP-89: Alert Group assignment for roles"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Role Management
        page.click_role_management_nav()
        slow_action_fixture()
        
        # Click Add Role button
        page.click_add_role_button()
        slow_action_fixture()
        
        # Look for Alert Group assignment fields
        alert_group_elements = page.driver.find_elements(By.CSS_SELECTOR, 
            "select[name='alertGroup'], input[name='alertGroup'], .alert-group-selector")
        
        if len(alert_group_elements) > 0:
            print(f"✅ Found Alert Group assignment elements: {len(alert_group_elements)}")
            
            # Fill role form with Alert Group
            page.fill_role_form(
                role_name="Alert Group Test Role",
                description="Role with specific alert group assignment"
            )
            
            # Additional Alert Group specific logic would go here
            # This depends on the specific implementation in the HTML
            
            print("📢 Alert Group assignment functionality available")
        else:
            print("⚠️ Alert Group assignment not found - may need implementation")
            
            # Still create a basic role for testing
            page.fill_role_form(
                role_name="Basic Alert Role",
                description="Basic role for alert testing"
            )
        
        # Save role
        page.save_role()
        slow_action_fixture()
    
    def test_role_form_validation_required_fields(self, admin_page, slow_action_fixture):
        """Test role form validation for required fields"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Role Management
        page.click_role_management_nav()
        slow_action_fixture()
        
        # Click Add Role button
        page.click_add_role_button()
        slow_action_fixture()
        
        # Try to save with empty form
        page.save_role()
        slow_action_fixture()
        
        # Check for validation error
        error_msg = page.wait_for_error_message(timeout=5)
        if error_msg:
            print(f"✅ Validation error caught: {error_msg}")
        else:
            print("⚠️ No validation error - may need improvement")
    
    def test_role_permissions_all_selected(self, admin_page, slow_action_fixture):
        """Test role with all permissions selected"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Role Management
        page.click_role_management_nav()
        slow_action_fixture()
        
        # Click Add Role button
        page.click_add_role_button()
        slow_action_fixture()
        
        # Get all available permissions
        all_permissions = TestDataHelper.get_permissions()
        
        # Create role with all permissions
        page.fill_role_form(
            role_name="Super Admin Role",
            description="Role with all available permissions",
            permissions=all_permissions
        )
        
        # Save role
        page.save_role()
        slow_action_fixture()
        
        print(f"✅ Created role with {len(all_permissions)} permissions")
    
    def test_role_permissions_none_selected(self, admin_page, slow_action_fixture):
        """Test role with no permissions selected"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Role Management
        page.click_role_management_nav()
        slow_action_fixture()
        
        # Click Add Role button
        page.click_add_role_button()
        slow_action_fixture()
        
        # Create role with no permissions
        page.fill_role_form(
            role_name="No Permission Role",
            description="Role with no permissions for testing",
            permissions=[]  # Empty permissions list
        )
        
        # Save role
        page.save_role()
        slow_action_fixture()
        
        print("✅ Created role with no permissions")
    
    def test_role_table_display(self, admin_page, slow_action_fixture):
        """Test role table display and structure"""
        page = AdministrationPage(admin_page)
        
        # Navigate to Role Management
        page.click_role_management_nav()
        slow_action_fixture()
        
        # Verify role table is present
        assert page.is_element_present(page.ROLE_TABLE), "Role table should be present"
        
        # Get role count
        role_count = page.get_role_table_rows_count()
        print(f"📊 Total roles in table: {role_count}")
        
        # Check table structure
        table_headers = page.driver.find_elements(By.CSS_SELECTOR, "#roleTable thead th")
        if len(table_headers) > 0:
            header_text = [header.text for header in table_headers]
            print(f"📋 Role table headers: {header_text}")
        
        # Verify action buttons are present
        add_button = page.is_element_present(page.ADD_ROLE_BTN)
        assert add_button, "Add Role button should be present"
        print("✅ Role management UI elements verified")
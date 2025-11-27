"""
Test data helper for E2E Communication Platform tests
Provides mock data for testing various scenarios
"""

class TestDataHelper:
    """Helper class for managing test data"""
    
    @staticmethod
    def get_mock_users():
        """Get mock user data for testing"""
        return [
            {
                'id': 'U001',
                'name': 'John Smith',
                'email': 'john.smith@company.com',
                'department': 'IT',
                'role': 'Administrator',
                'status': 'Active',
                'location': 'Hong Kong'
            },
            {
                'id': 'U002', 
                'name': 'Mary Johnson',
                'email': 'mary.johnson@company.com',
                'department': 'Operations',
                'role': 'Manager',
                'status': 'Active',
                'location': 'Kowloon'
            },
            {
                'id': 'U003',
                'name': 'David Chen',
                'email': 'david.chen@company.com',
                'department': 'Engineering',
                'role': 'Engineer',
                'status': 'Inactive',
                'location': 'New Territories'
            },
            {
                'id': 'U004',
                'name': 'Sarah Wilson',
                'email': 'sarah.wilson@company.com',
                'department': 'Customer Service',
                'role': 'Operator',
                'status': 'Active',
                'location': 'Hong Kong'
            }
        ]
    
    @staticmethod
    def get_mock_roles():
        """Get mock role data for testing"""
        return [
            {
                'name': 'Administrator',
                'description': 'Full system access and management privileges',
                'permissions': ['user_management', 'role_management', 'settings_management', 'system_administration']
            },
            {
                'name': 'Manager',
                'description': 'Department management and reporting access',
                'permissions': ['user_view', 'notification_management', 'reporting']
            },
            {
                'name': 'Engineer',
                'description': 'Technical operations and maintenance access',
                'permissions': ['outage_management', 'technical_notifications', 'system_monitoring']
            },
            {
                'name': 'Operator',
                'description': 'Basic operational access',
                'permissions': ['notification_view', 'basic_operations']
            }
        ]
    
    @staticmethod
    def get_mock_settings():
        """Get mock settings data for testing"""
        return {
            'communication': {
                'email_notifications': True,
                'sms_notifications': True,
                'push_notifications': False
            },
            'delays': {
                'planned_outage_delay': 60,  # minutes
                'unplanned_outage_delay': 15,  # minutes
                'emergency_delay': 5  # minutes
            },
            'extreme_weather': {
                'enabled': False,
                'temperature_threshold': 35,  # Celsius
                'wind_speed_threshold': 60  # km/h
            }
        }
    
    @staticmethod
    def get_departments():
        """Get list of available departments"""
        return ['IT', 'Operations', 'Engineering', 'Customer Service', 'Finance', 'HR']
    
    @staticmethod
    def get_locations():
        """Get list of available locations"""
        return ['Hong Kong', 'Kowloon', 'New Territories', 'Lantau Island']
    
    @staticmethod
    def get_user_statuses():
        """Get list of user status options"""
        return ['Active', 'Inactive', 'Pending', 'Suspended']
    
    @staticmethod
    def get_permissions():
        """Get list of available permissions"""
        return [
            'user_management',
            'role_management', 
            'settings_management',
            'system_administration',
            'user_view',
            'notification_management',
            'reporting',
            'outage_management',
            'technical_notifications',
            'system_monitoring',
            'notification_view',
            'basic_operations'
        ]
    
    @staticmethod
    def create_test_user(user_id=None, name=None, email=None, department=None, role=None, status='Active', location=None):
        """Create a test user with specified or random data"""
        import random
        import string
        
        if not user_id:
            user_id = f"U{random.randint(100, 999)}"
        
        if not name:
            first_names = ['John', 'Mary', 'David', 'Sarah', 'Michael', 'Lisa', 'James', 'Jennifer']
            last_names = ['Smith', 'Johnson', 'Chen', 'Wilson', 'Brown', 'Davis', 'Miller', 'Moore']
            name = f"{random.choice(first_names)} {random.choice(last_names)}"
        
        if not email:
            email = f"{name.lower().replace(' ', '.')}@company.com"
        
        if not department:
            department = random.choice(TestDataHelper.get_departments())
        
        if not role:
            roles = [role['name'] for role in TestDataHelper.get_mock_roles()]
            role = random.choice(roles)
        
        if not location:
            location = random.choice(TestDataHelper.get_locations())
        
        return {
            'id': user_id,
            'name': name,
            'email': email,
            'department': department,
            'role': role,
            'status': status,
            'location': location
        }
    
    @staticmethod
    def create_test_role(name=None, description=None, permissions=None):
        """Create a test role with specified or random data"""
        import random
        
        if not name:
            role_prefixes = ['Test', 'Demo', 'Sample', 'Mock']
            role_suffixes = ['Role', 'User', 'Admin', 'Manager']
            name = f"{random.choice(role_prefixes)} {random.choice(role_suffixes)}"
        
        if not description:
            description = f"Test role for {name} with limited permissions"
        
        if not permissions:
            all_permissions = TestDataHelper.get_permissions()
            # Select 2-4 random permissions
            permission_count = random.randint(2, 4)
            permissions = random.sample(all_permissions, permission_count)
        
        return {
            'name': name,
            'description': description,
            'permissions': permissions
        }
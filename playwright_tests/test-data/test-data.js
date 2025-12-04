/**
 * Test Data Helper for E2E Communication Platform Tests
 * Provides mock data for testing various scenarios
 * JavaScript port of python_tests/helpers/test_data.py
 */

class TestDataHelper {
  /**
   * Get mock user data for testing
   */
  static getMockUsers() {
    return [
      {
        id: 'U001',
        name: 'John Smith',
        email: 'john.smith@company.com',
        role: 'System Admin',
        status: 'Active'
      },
      {
        id: 'U002',
        name: 'Mary Johnson',
        email: 'mary.johnson@company.com',
        role: 'Account Manager',
        status: 'Active'
      },
      {
        id: 'U003',
        name: 'David Chen',
        email: 'david.chen@company.com',
        role: 'CIC Team',
        status: 'Inactive'
      },
      {
        id: 'U004',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@company.com',
        role: 'Management',
        status: 'Active'
      }
    ];
  }

  /**
   * Get mock role data for testing
   */
  static getMockRoles() {
    return [
      {
        name: 'System Admin',
        description: 'Full system access and management privileges',
        permissions: ['user_management', 'role_management', 'settings_management', 'system_administration']
      },
      {
        name: 'CIC Team',
        description: 'Communication and incident coordination access',
        permissions: ['user_view', 'notification_management', 'reporting']
      },
      {
        name: 'Account Manager',
        description: 'Customer account management access',
        permissions: ['customer_management', 'notification_management']
      },
      {
        name: 'Management',
        description: 'Management level access',
        permissions: ['reporting', 'notification_view']
      }
    ];
  }

  /**
   * Get mock settings data for testing
   */
  static getMockSettings() {
    return {
      communication: {
        email_notifications: true,
        sms_notifications: true,
        push_notifications: false
      },
      delays: {
        planned_outage_delay: 60,  // minutes
        unplanned_outage_delay: 15,  // minutes
        emergency_delay: 5  // minutes
      },
      extreme_weather: {
        enabled: false,
        temperature_threshold: 35,  // Celsius
        wind_speed_threshold: 60  // km/h
      }
    };
  }

  /**
   * Get list of available departments
   */
  static getDepartments() {
    return ['IT', 'Operations', 'Engineering', 'Customer Service', 'Finance', 'HR'];
  }

  /**
   * Get list of available locations
   */
  static getLocations() {
    return ['Hong Kong', 'Kowloon', 'New Territories', 'Lantau Island'];
  }

  /**
   * Get list of user status options
   */
  static getUserStatuses() {
    return ['Active', 'Inactive', 'Pending', 'Suspended'];
  }

  /**
   * Get list of available permissions
   */
  static getPermissions() {
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
    ];
  }

  /**
   * Create a test user with specified or random data
   * @param {Object} options - User options
   * @returns {Object} User object
   */
  static createTestUser({
    userId = null,
    name = null,
    email = null,
    role = null
  } = {}) {
    if (!userId) {
      userId = `U${Math.floor(Math.random() * 900) + 100}`;
    }

    if (!name) {
      const firstNames = ['John', 'Mary', 'David', 'Sarah', 'Michael', 'Lisa', 'James', 'Jennifer'];
      const lastNames = ['Smith', 'Johnson', 'Chen', 'Wilson', 'Brown', 'Davis', 'Miller', 'Moore'];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      name = `${firstName} ${lastName}`;
    }

    if (!email) {
      email = `${name.toLowerCase().replace(' ', '.')}@company.com`;
    }

    if (!role) {
      const roles = this.getMockRoles().map(r => r.name);
      role = roles[Math.floor(Math.random() * roles.length)];
    }

    // New users are always Active (no status parameter needed)
    return {
      id: userId,
      name,
      email,
      role
    };
  }

  /**
   * Create a test role with specified or random data
   * @param {Object} options - Role options
   * @returns {Object} Role object
   */
  static createTestRole({
    name = null,
    description = null,
    permissions = null
  } = {}) {
    if (!name) {
      const rolePrefixes = ['Test', 'Demo', 'Sample', 'Mock'];
      const roleSuffixes = ['Role', 'User', 'Admin', 'Manager'];
      const prefix = rolePrefixes[Math.floor(Math.random() * rolePrefixes.length)];
      const suffix = roleSuffixes[Math.floor(Math.random() * roleSuffixes.length)];
      name = `${prefix} ${suffix}`;
    }

    if (!description) {
      description = `Test role for ${name} with limited permissions`;
    }

    if (!permissions) {
      const allPermissions = this.getPermissions();
      // Select 2-4 random permissions
      const permissionCount = Math.floor(Math.random() * 3) + 2; // 2-4
      permissions = [];
      const shuffled = [...allPermissions].sort(() => 0.5 - Math.random());
      permissions = shuffled.slice(0, permissionCount);
    }

    return {
      name,
      description,
      permissions
    };
  }

  /**
   * Generate bulk user data for upload testing
   * @param {number} count - Number of users to generate
   * @returns {Array} Array of user objects
   */
  static generateBulkUsers(count = 10) {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(this.createTestUser({ userId: `BULK${String(i + 1).padStart(3, '0')}` }));
    }
    return users;
  }

  /**
   * Convert user data to CSV format for bulk upload testing
   * @param {Array} users - Array of user objects
   * @returns {string} CSV string
   */
  static usersToCSV(users) {
    const headers = ['User ID', 'Name', 'Email', 'Department', 'Role', 'Status', 'Location'];
    const rows = users.map(user => [
      user.id,
      user.name,
      user.email,
      user.department,
      user.role,
      user.status,
      user.location
    ]);
    
    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }
}

module.exports = TestDataHelper;

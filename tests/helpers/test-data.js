/**
 * Test data for E2E Communication Platform tests
 * Based on Jira stories and user requirements
 */

class TestData {
  static users = [
    {
      staffID: 'EMP001',
      name: 'Alice Wong',
      email: 'alice.wong@clp.com.hk',
      role: 'System Administrator',
      status: 'Active',
      lastLogin: '2025-11-20 14:30'
    },
    {
      staffID: 'EMP002', 
      name: 'Bob Chen',
      email: 'bob.chen@clp.com.hk',
      role: 'Communication Manager',
      status: 'Active',
      lastLogin: '2025-11-21 09:15'
    },
    {
      staffID: 'EMP003',
      name: 'Carol Li',
      email: 'carol.li@clp.com.hk', 
      role: 'Call Center Agent',
      status: 'Inactive',
      lastLogin: '2025-11-15 16:45'
    },
    {
      staffID: 'EMP004',
      name: 'David Lam',
      email: 'david.lam@clp.com.hk',
      role: 'Field Operations',
      status: 'Active', 
      lastLogin: '2025-11-21 08:00'
    },
    {
      staffID: 'EMP005',
      name: 'Emma Tsang',
      email: 'emma.tsang@clp.com.hk',
      role: 'Account Manager',
      status: 'Active',
      lastLogin: '2025-11-20 17:20'
    }
  ];

  static roles = [
    {
      name: 'System Administrator',
      activeUsers: 2,
      permissions: [
        'Full Dashboard Access',
        'Outage Management', 
        'Emergency Stop',
        'User Administration',
        'Template Management',
        'Send Notifications',
        'Receive Notifications',
        'Access Residential Customer Information',
        'Access Non-Residential Customer Information',
        'Download Data',
        'Receive Outage Notification'
      ]
    },
    {
      name: 'Communication Manager',
      activeUsers: 3,
      permissions: [
        'Full Dashboard Access',
        'Template Management',
        'Send Notifications', 
        'Receive Notifications',
        'Access Residential Customer Information',
        'Access Non-Residential Customer Information',
        'Download Data'
      ]
    },
    {
      name: 'Call Center Agent',
      activeUsers: 15,
      permissions: [
        'Access Residential Customer Information',
        'Receive Notifications',
        'Download Data'
      ]
    },
    {
      name: 'Field Operations',
      activeUsers: 8,
      permissions: [
        'Outage Management',
        'Receive Notifications',
        'Access Residential Customer Information'
      ]
    },
    {
      name: 'Account Manager', 
      activeUsers: 5,
      permissions: [
        'Full Dashboard Access',
        'Access Residential Customer Information',
        'Access Non-Residential Customer Information', 
        'Download Data',
        'Receive Notifications'
      ]
    }
  ];

  static newUserData = {
    validUser: {
      staffID: 'EMP999',
      name: 'Test User',
      email: 'test.user@clp.com.hk',
      role: 'Call Center Agent'
    },
    invalidUser: {
      staffID: '',
      name: '',
      email: 'invalid-email',
      role: ''
    }
  };

  static csvTestData = {
    validCSV: `staffID,role
EMP101,Call Center Agent
EMP102,Field Operations
EMP103,Account Manager`,
    invalidCSV: `staffID,role
,Call Center Agent
EMP102,InvalidRole
EMP103,Account Manager`
  };

  static settingsData = {
    communicationSettings: {
      internalCommunication: true,
      externalCommunication: true,
      autoTrigger: true,
      manualTrigger: false,
      extremeWeatherMode: false
    },
    delaySettings: {
      externalNotificationDelay: 5,
      extremeWeatherDelay: 15,
      autoUpdateInterval: 30,
      alertTimeInterval: 60,
      maxUpdateCount: 3
    },
    dataRetention: {
      customerDataRetention: 365,
      outageDataRetention: 730
    }
  };

  // Helper methods
  static getRandomUser() {
    const randomIndex = Math.floor(Math.random() * this.users.length);
    return this.users[randomIndex];
  }

  static getRandomRole() {
    const randomIndex = Math.floor(Math.random() * this.roles.length);
    return this.roles[randomIndex];
  }

  static getUserByStatus(status) {
    return this.users.filter(user => user.status === status);
  }

  static getUserByRole(roleName) {
    return this.users.filter(user => user.role === roleName);
  }
}

module.exports = TestData;
# 📋 Comprehensive Test Case Creation Prompt Template

## 🎯 **Objective**
Create comprehensive, detailed test cases for QA teams based on Jira stories and UI prototypes, following a structured approach that ensures thorough coverage and actionable test instructions.

## � **Test Data Preparation Section**
Before creating test cases, establish a comprehensive test data inventory that includes:

### **User Test Data**
- Valid Staff IDs with corresponding names and emails
- Invalid/non-existent Staff IDs for negative testing
- User accounts with different roles and statuses
- Active and inactive user examples

### **System Configuration Data**
- Default system settings and limits
- Valid configuration ranges and values
- Invalid configuration attempts
- System capacity limits and thresholds

### **Business Data**
- Customer accounts for opt-out testing
- Role and permission matrices
- Template and notification examples
- Historical data for reporting tests

### **Error Simulation Data**
- Network failure scenarios
- Database connectivity issues
- Session timeout conditions
- Concurrent operation conflicts

## �📝 **Prompt Template**

```
I need you to create comprehensive test cases for the [MODULE_NAME] module. This is not for automated testing but for manual QA testing documentation.

**Requirements:**
1. Separate test cases into 4 categories: Happy Flow, Unhappy Flow, Edge Cases, Exception/Error scenarios
2. Create a structured CSV format with columns: Section | Module | Function | Action | Description | Priority | Severity | Test Data
3. Group test cases by epics/modules and functions
4. Include specific test data with exact values, expected outcomes, and structured data formats
5. Create a companion test data preparation section listing all required data

**Test Case Detail Requirements:**
- Write detailed step-by-step actions using numbered sequences with indented sub-steps
- Include specific UI element identification (buttons, dropdowns, input fields, etc.)
- Integrate verification steps directly within action sequences using indented verification points
- Specify expected outcomes and confirmation messages as part of each action step
- Include prerequisites and specific test data requirements
- Cover both positive and negative scenarios for each function

**Action Format Example with Grouped Sub-steps:**
Instead of: "Navigate to Users > Add user > Enter data > Save"
Use: 
"1. Click the menu icon at the top left side to open navigation
2. Navigate to Administration and click Users tab
3. Click Add New User button in the action buttons section
    - Verify popup form opens with input fields for StaffID and Role
4. Enter StaffID 93313 in the StaffID field
    - Verify auto-filled name and email fields populate correctly
5. Select System Admin from role dropdown
6. Click Create button
    - Verify new user appears in first row of user list
    - Verify success confirmation message displays"

**Grouping Related Actions Example:**
When testing a complex workflow, group related sub-tasks:
"1. Access user management interface
    - Click the menu and navigate to Administration 
    - Click Users tab and verify all users are displayed
    - Verify pagination functionality if multiple pages exist
2. Apply filtering criteria
    - Click to open the role filter dropdown
    - Verify dropdown shows all available roles
    - Select System Admin from filter options
    - Verify filtered results show only System Admin users
3. Verify filter functionality
    - Clear all filters and verify all users return to view
    - Test multiple filter combinations for accuracy"

**Coverage Areas:**
- All CRUD operations (Create, Read, Update, Delete) with specific data examples
- UI interactions (filters, search, pagination, sorting) with exact element identification
- Validation scenarios (required fields, format checks, duplicates) with specific error messages
- Permission and role-based access testing with detailed role specifications
- Integration points with external systems including failure simulation
- Error handling and recovery scenarios with specific error conditions
- Performance edge cases (large datasets, concurrent operations) with measurable thresholds
- Security scenarios (unauthorized access, session management) with detailed attack simulations

**Priority Levels:**
- High: Core business functionality, critical user paths, essential system operations
- Medium: Important features, secondary workflows, configuration management
- Low: Nice-to-have features, minor edge cases, cosmetic improvements

**Severity Levels:**
- Critical: System crashes, data loss, security breaches, system unavailability
- High: Major functionality broken, significant user impact, data corruption risk
- Medium: Feature limitations, workarounds available, minor functionality issues
- Low: Minor issues, cosmetic problems, non-critical edge cases

**Test Data Requirements:**
Specify exact test data values and expected outcomes:
- Use specific identifiers: "StaffID: 93313" instead of "valid StaffID"
- Include expected auto-fill results: "Expected Name: Arthur Smith; Expected Email: Arthur.smith@clp.com.hk"
- Specify filter criteria: "Roles: System Admin / CIC Team / Account Manager"
- Define error conditions: "Invalid StaffID: 99999; Expected error: User not found"
- List dependent data: "User: Arthur Smith (created in previous test)"
- Include system limits: "CSV file size: 15MB; Expected error: File size exceeds 10MB limit"

**Test Data Structure Example:**
"User Data:
Staff ID: 93313
Name: Arthur Smith  
Email: arthur.smith@clp.com.hk
Role: System Admin
Expected auto-fill verification required"

Create a separate test data preparation section with:
- Valid values for all data fields with specific examples
- Invalid values that should trigger validation with expected error messages
- Edge cases (boundary values, special characters) with expected behaviors
- System limit scenarios with specific thresholds
- Error condition data for negative testing scenarios

**Sources to Analyze:**
1. [Jira stories/requirements document]
2. [UI prototype/mockup files]
3. [Existing system documentation if available]

Please review the provided Jira stories and UI prototype, then create:
1. [Module]_Test_Cases.csv - Comprehensive test cases with grouped actions and integrated verifications
2. [Module]_Test_Data.csv - Supporting test data with specific values and expected outcomes

Focus on creating actionable, detailed test cases with specific test data that a QA engineer can execute without ambiguity. Include dependent test scenarios and cross-reference data between related test cases.
```

## 🔧 **Customization Guidelines**

### **For Different Modules:**
Replace `[MODULE_NAME]` with:
- Administration
- Template Management  
- Notification Management
- Outage History
- Dashboard
- etc.

### **For Different Project Types:**
Adjust the coverage areas based on your project:
- **Web Applications**: Focus on browser compatibility, responsive design
- **Mobile Apps**: Add device-specific testing, offline scenarios
- **APIs**: Include endpoint testing, payload validation
- **Integration Systems**: Emphasize data flow, system connectivity

### **Industry-Specific Additions:**
- **Financial Systems**: Add compliance, audit trail testing
- **Healthcare**: Include HIPAA, patient data security
- **Utilities (like E2E)**: Add emergency procedures, customer communication
- **E-commerce**: Include payment processing, inventory management

## 📊 **Quality Checklist**

Before finalizing test cases, verify:
- ✅ Each test case has clear, numbered steps with logical sub-step groupings
- ✅ Prerequisites and specific test data values are detailed
- ✅ Verification steps are integrated within action sequences
- ✅ Expected outcomes include specific confirmation messages and UI states
- ✅ Error scenarios include specific error messages and recovery steps
- ✅ UI interactions specify exact element names and locations
- ✅ Integration points include failure simulation and recovery testing
- ✅ Security aspects cover unauthorized access and session management
- ✅ Performance edge cases include measurable thresholds and limits
- ✅ Test data dependencies are clearly documented and cross-referenced

## 🎯 **Success Criteria**

Your test cases should enable QA teams to:
1. Execute tests without ambiguity using specific test data values
2. Identify exactly what to click/enter/verify with precise UI element references
3. Understand expected vs actual results through integrated verification steps
4. Follow logical action groupings that reflect real user workflows
5. Cover all critical business scenarios including error conditions and edge cases
6. Reference dependent test data and cross-validate between related test cases
7. Catch defects before production release through comprehensive coverage

## 📝 **Example Usage**

```
I need you to create comprehensive test cases for the Template Management module. This is not for automated testing but for manual QA testing documentation.

[Insert full prompt template above with Template Management specifics]

**Sources to Analyze:**
1. Jira stories for Template Management epic (EP-4)
2. template-management.html prototype file
3. Message template requirements from stakeholders

Please review the provided Jira stories and UI prototype, then create:
1. Template_Management_Test_Cases.csv - Comprehensive test cases  
2. Template_Management_Test_Data.csv - Supporting test data

Focus on creating actionable, detailed test cases that a QA engineer can execute without ambiguity.
```

---

**💡 Pro Tip:** Always review the generated test cases with domain experts to ensure business logic accuracy and completeness.

**🔄 Version:** 1.0 | **Date:** November 21, 2025 | **Module:** Universal Test Case Creation
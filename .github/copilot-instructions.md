---
applyTo: "**"
---
# Project general coding standards

## Prompt handling
- Ask questions if the prompt is ambiguous or lacks sufficient detail
- Confirm requirements before proceeding with implementation

## Artifacts Structure
- Use clear and descriptive file and directory names
- Always create directories to keep related files (e.g. Pytest, Playwright_test, test_result, Artifacts, etc.)
- Organize files logically by feature or module
- Include README files in directories to explain their purpose

## Naming Conventions
- Use PascalCase for component names, interfaces, and type aliases
- Use camelCase for variables, functions, and methods
- Prefix private class members with underscore (_)
- Use ALL_CAPS for constants
- use commom IDs for HTML elements, e.g., `submitBtn`, `userList`

## Visual Consistency
- Follow the existing design system and style guide
- Ensure consistent spacing, margins, and padding
- Use a consistent color palette and typography
- Ensure complete user visual feedback for interactive elements
- Live update to reflect data changes
- Always shows update and error messages for user actions

## Database Interactions
- Use parameterized queries to prevent SQL injection
- Always closes database connections in a finally block
- Use transactions for batch operations to ensure data integrity
- Create CSV as database if it is a HTML, ensure data fetch and update from database

## Error Handling
- Use try/catch blocks for async operations
- Implement proper error boundaries in React components
- Always log errors with contextual information
- Always include comphrehensive debugging information in error logs
- Provide user-friendly error messages
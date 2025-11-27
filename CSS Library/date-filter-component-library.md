# Date Filter Component Library

## Overview
A reusable date filter dropdown component with preset options and dual calendar view for custom date range selection.

## Features
- **Preset Date Ranges**:
  - Today
  - Past 7 days
  - Previous 30 days
  - Previous year
- **Custom Date Range**: Dual calendar view for selecting start and end dates
- **Clear Filter**: Option to reset the date filter
- **Visual Feedback**: Selected dates and date ranges are highlighted
- **Responsive Design**: Clean, modern UI that fits with existing styles

## Screenshot
![Date Filter Component](c:\Users\AC93313\OneDrive - CLP\Pictures\Screenshots\Screenshot 2025-10-30 164518.png)

## Installation

### 1. HTML Structure
Add this HTML where you want the date filter to appear:

```html
<!-- Custom Date Filter -->
<div class="date-filter-dropdown" id="dateFilterDropdown">
    <div class="date-filter-trigger" onclick="toggleDateFilter()">
        <span id="dateFilterDisplay">Date</span>
        <span class="filter-icon">📅</span>
    </div>
    <div class="date-filter-content" id="dateFilterContent">
        <div class="date-filter-layout">
            <!-- Preset Options -->
            <div class="date-preset-options">
                <div class="date-preset-item" onclick="selectDatePreset('today')">Today</div>
                <div class="date-preset-item" onclick="selectDatePreset('past7')">Past 7 days</div>
                <div class="date-preset-item" onclick="selectDatePreset('past30')">Previous 30 days</div>
                <div class="date-preset-item" onclick="selectDatePreset('pastYear')">Previous year</div>
                <div class="date-preset-divider"></div>
                <button class="date-clear-btn" onclick="clearDateFilter()">Clear filter</button>
            </div>
            
            <!-- Calendar Section -->
            <div class="date-calendar-section">
                <div class="calendar-controls">
                    <button class="calendar-nav-btn" onclick="previousMonth('start')">&lt;&lt;</button>
                    <button class="calendar-nav-btn" onclick="previousMonth('start', false)">&lt;</button>
                    <span class="calendar-month" id="startMonthDisplay">January 2025</span>
                    <button class="calendar-nav-btn" onclick="nextMonth('start', false)">&gt;</button>
                    <button class="calendar-nav-btn" onclick="nextMonth('start')">&gt;&gt;</button>
                </div>
                <div class="calendar-grid" id="startCalendar"></div>
                
                <div class="calendar-controls">
                    <button class="calendar-nav-btn" onclick="previousMonth('end')">&lt;&lt;</button>
                    <button class="calendar-nav-btn" onclick="previousMonth('end', false)">&lt;</button>
                    <span class="calendar-month" id="endMonthDisplay">February 2025</span>
                    <button class="calendar-nav-btn" onclick="nextMonth('end', false)">&gt;</button>
                    <button class="calendar-nav-btn" onclick="nextMonth('end')">&gt;&gt;</button>
                </div>
                <div class="calendar-grid" id="endCalendar"></div>
                
                <div class="calendar-actions">
                    <button class="calendar-btn calendar-cancel" onclick="cancelDateSelection()">Cancel</button>
                    <button class="calendar-btn calendar-apply" onclick="applyDateSelection()">Apply Dates</button>
                </div>
            </div>
        </div>
    </div>
</div>
```

### 2. CSS Styles
Copy the entire CSS section from `notification-management.html` between these comments:
```css
/* ============================================================
   REUSABLE COMPONENT: Date Filter Dropdown Styles
   ============================================================ */

/* ... all styles ... */

/* ============================================================
   END: Date Filter Dropdown Styles
   ============================================================ */
```

**Key CSS Classes:**
- `.date-filter-dropdown` - Main container
- `.date-filter-trigger` - Clickable dropdown trigger
- `.date-filter-content` - Dropdown panel content
- `.date-preset-options` - Left sidebar with preset options
- `.date-calendar-section` - Right section with calendars
- `.calendar-grid` - Calendar day grid
- `.calendar-day` - Individual calendar day cell
- `.calendar-day.selected` - Selected date styling
- `.calendar-day.in-range` - Date range styling

### 3. JavaScript Functions
Copy the entire JavaScript section from `notification-management.html` between these comments:

```javascript
// ============================================================
// REUSABLE COMPONENT: Date Filter with Calendar
// ============================================================

// ... all functions ...

// ============================================================
// END: Date Filter with Calendar Component
// ============================================================
```

**Core Functions:**
- `toggleDateFilter()` - Open/close the dropdown
- `selectDatePreset(preset)` - Apply preset date ranges
- `clearDateFilter()` - Clear the date filter
- `renderCalendar(type, month)` - Render calendar grid
- `selectCalendarDate(type, year, month, day)` - Select a date from calendar
- `previousMonth(type, double)` - Navigate to previous month(s)
- `nextMonth(type, double)` - Navigate to next month(s)
- `applyDateSelection()` - Apply custom date range
- `cancelDateSelection()` - Cancel and close dropdown
- `updateDateFilterDisplay()` - Update the display text

### 4. State Management
The component uses a global state object:

```javascript
let dateFilterState = {
    startDate: null,        // Selected start date
    endDate: null,          // Selected end date
    startMonth: new Date(2025, 0),  // Display month for start calendar
    endMonth: new Date(2025, 1),    // Display month for end calendar
    selectedPreset: null    // Currently selected preset
};
```

## Usage

### Basic Integration
1. Add the HTML structure to your page
2. Copy the CSS styles
3. Copy the JavaScript functions
4. Initialize the calendars when the page loads:
   ```javascript
   // Initialize calendars on page load
   renderCalendar('start', dateFilterState.startMonth);
   renderCalendar('end', dateFilterState.endMonth);
   ```

### Multiple Instances
If you need multiple date filters on the same page:
1. Update all IDs to be unique (e.g., `dateFilterDropdown1`, `dateFilterDropdown2`)
2. Create separate state objects for each instance
3. Pass the instance ID as a parameter to functions

### Customization

#### Change Preset Options
Modify the preset options in `selectDatePreset()`:
```javascript
switch(preset) {
    case 'today':
        startDate = endDate = new Date(today);
        break;
    case 'custom':
        // Add your custom preset logic
        break;
}
```

#### Change Calendar Display
Modify the initial months in the state object:
```javascript
let dateFilterState = {
    startMonth: new Date(2025, 0),  // January 2025
    endMonth: new Date(2025, 1),    // February 2025
};
```

#### Customize Styles
Override CSS variables or classes:
```css
.date-filter-dropdown {
    min-width: 300px;  /* Adjust width */
}

.calendar-day.selected {
    background-color: #ff6b6b;  /* Change selected color */
}
```

## Integration with Filters

### Example: Filter Table Rows
```javascript
function filterData() {
    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        const rowDateStr = row.cells[0].textContent.trim();
        const rowDate = new Date(rowDateStr);
        
        let showRow = true;
        
        // Filter by date range
        if (dateFilterState.startDate && dateFilterState.endDate) {
            const startDate = new Date(dateFilterState.startDate);
            const endDate = new Date(dateFilterState.endDate);
            
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            rowDate.setHours(0, 0, 0, 0);
            
            if (rowDate < startDate || rowDate > endDate) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
}
```

### Call Filter After Date Selection
Update `selectDatePreset()` and `applyDateSelection()` to call your filter function:
```javascript
function selectDatePreset(preset) {
    // ... existing code ...
    
    filterData();  // Call your filter function
    document.getElementById('dateFilterDropdown').classList.remove('open');
}

function applyDateSelection() {
    if (dateFilterState.startDate && dateFilterState.endDate) {
        updateDateFilterDisplay();
        filterData();  // Call your filter function
    }
    document.getElementById('dateFilterDropdown').classList.remove('open');
}
```

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ⚠️ Requires polyfills for Date methods

## Dependencies
None - Pure vanilla JavaScript and CSS

## License
Free to use within CLP E2E Outage Platform project

## Changelog

### Version 1.0 (2025-10-30)
- Initial release
- Preset date ranges (Today, Past 7 days, Past 30 days, Past year)
- Dual calendar view for custom date range
- Clear filter functionality
- Visual feedback for selected dates and ranges
- Click-outside to close dropdown

## Support
For questions or issues, contact the development team.

## Example Implementation
See `notification-management.html` History section for a complete working example.

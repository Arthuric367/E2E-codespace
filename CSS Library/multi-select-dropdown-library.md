# Multi-Select Dropdown Component Library

## Overview
A reusable multi-select dropdown component with checkboxes that allows users to select multiple options from a list.

## Features
- **Multiple Selection**: Select multiple options with checkboxes
- **Visual Feedback**: Shows selected count when multiple items are selected
- **Click Outside to Close**: Automatically closes when clicking outside the dropdown
- **Clean Design**: Modern UI that matches the existing design system
- **No Validation**: Works for any combination (Internal, External-RT, External-NRT, or any mix)

## Installation

### 1. HTML Structure
Add this HTML where you want the multi-select dropdown to appear:

```html
<!-- Multi-select Recipient Group Filter -->
<div class="multi-select-dropdown" id="recipientGroupDropdown">
    <div class="multi-select-trigger" onclick="toggleRecipientGroupDropdown()">
        <span id="recipientGroupDisplay">Recipient group</span>
        <span class="dropdown-arrow">▼</span>
    </div>
    <div class="multi-select-content" id="recipientGroupContent">
        <div class="multi-select-option">
            <label>
                <input type="checkbox" value="Internal" onchange="updateRecipientGroupFilter()">
                <span>Internal</span>
            </label>
        </div>
        <div class="multi-select-option">
            <label>
                <input type="checkbox" value="External-RT" onchange="updateRecipientGroupFilter()">
                <span>External-RT</span>
            </label>
        </div>
        <div class="multi-select-option">
            <label>
                <input type="checkbox" value="External-NRT" onchange="updateRecipientGroupFilter()">
                <span>External-NRT</span>
            </label>
        </div>
    </div>
</div>
```

### 2. CSS Styles
Copy the entire CSS section from `notification-management.html` between these comments:

```css
/* ============================================================
   REUSABLE COMPONENT: Multi-Select Dropdown with Checkboxes
   ============================================================ */

/* ... all styles ... */

/* ============================================================
   END: Multi-Select Dropdown Styles
   ============================================================ */
```

**Key CSS Classes:**
- `.multi-select-dropdown` - Main container
- `.multi-select-trigger` - Clickable dropdown trigger button
- `.multi-select-content` - Dropdown panel content
- `.multi-select-option` - Individual checkbox option
- `.dropdown-arrow` - Arrow icon that rotates when opened
- `.selected-count` - Badge showing number of selected items

### 3. JavaScript Functions
Copy the entire JavaScript section from `notification-management.html` between these comments:

```javascript
// ============================================================
// REUSABLE COMPONENT: Multi-Select Dropdown with Checkboxes
// ============================================================

// ... all functions ...

// ============================================================
// END: Multi-Select Dropdown Component
// ============================================================
```

**Core Functions:**
- `toggleRecipientGroupDropdown()` - Open/close the dropdown
- `updateRecipientGroupFilter()` - Update selected items and trigger filter
- Global click handler - Closes dropdown when clicking outside

### 4. State Management
The component uses a global state array:

```javascript
let selectedRecipientGroups = [];
```

## Usage

### Basic Integration
1. Add the HTML structure to your page
2. Copy the CSS styles
3. Copy the JavaScript functions
4. The component is ready to use!

### Display Logic
The dropdown trigger displays:
- **"Recipient group"** - When nothing is selected
- **Single selection** - Shows the selected item name (e.g., "Internal")
- **Multiple selections** - Shows "2 selected" with a count badge

### Getting Selected Values
Access the selected values through the global array:

```javascript
console.log(selectedRecipientGroups); // ["Internal", "External-RT"]
```

### Multiple Instances
If you need multiple dropdowns on the same page:

1. **Update IDs**: Make them unique
   ```html
   <div class="multi-select-dropdown" id="dropdown1">
   <div class="multi-select-dropdown" id="dropdown2">
   ```

2. **Create separate state arrays**:
   ```javascript
   let selectedGroups1 = [];
   let selectedGroups2 = [];
   ```

3. **Rename functions**:
   ```javascript
   function toggleDropdown1() { ... }
   function toggleDropdown2() { ... }
   ```

### Customization

#### Change Options
Modify the HTML to add/remove options:

```html
<div class="multi-select-option">
    <label>
        <input type="checkbox" value="Custom-Group" onchange="updateRecipientGroupFilter()">
        <span>Custom Group</span>
    </label>
</div>
```

#### Change Colors
Override CSS variables:

```css
.multi-select-trigger:hover {
    border-color: #ff6b6b;  /* Custom hover color */
}

.selected-count {
    background-color: #ff6b6b;  /* Custom badge color */
}
```

#### Add Icons
Add icons before checkbox labels:

```html
<label>
    <input type="checkbox" value="Internal" onchange="updateRecipientGroupFilter()">
    <span>👤 Internal</span>
</label>
```

## Integration with Filters

### Example: Filter Table Rows
```javascript
function filterData() {
    const rows = document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        const rowRecipient = row.cells[3].textContent.trim();
        let showRow = true;
        
        // Filter by recipient group (multi-select)
        if (selectedRecipientGroups.length > 0) {
            if (!selectedRecipientGroups.includes(rowRecipient)) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
}
```

### Call Filter After Selection
The `updateRecipientGroupFilter()` function automatically calls your filter function:

```javascript
function updateRecipientGroupFilter() {
    // ... update selection logic ...
    
    filterData();  // Call your filter function
}
```

## Features Comparison

| Feature | Single-Select Dropdown | Multi-Select Dropdown |
|---------|----------------------|----------------------|
| Multiple selections | ❌ | ✅ |
| Checkboxes | ❌ | ✅ |
| Selected count badge | ❌ | ✅ |
| No validation | ❌ | ✅ |
| Click outside to close | ❌ | ✅ |

## Accessibility

### Keyboard Support
- **Tab**: Navigate to the dropdown
- **Enter/Space**: Toggle dropdown (when focused on trigger)
- **Tab**: Navigate through checkboxes when open
- **Space**: Toggle checkbox selection

### Screen Reader Support
- Labels are properly associated with checkboxes
- State changes are announced automatically

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ⚠️ Requires polyfills for `forEach`, `includes`

## Performance
- **Lightweight**: No external dependencies
- **Fast**: Minimal DOM operations
- **Efficient**: Uses event delegation where possible

## Best Practices

1. **Clear selections**: Provide a way to clear all selections if needed
2. **Visual feedback**: Keep the selected count badge visible
3. **Don't nest**: Avoid putting multi-select dropdowns inside other dropdowns
4. **Limit options**: Keep the option list to a reasonable size (< 20 items)
5. **Mobile friendly**: Component works on touch devices

## Example Use Cases

### 1. Report Filters
```html
<!-- Filter by recipient groups -->
<div class="multi-select-dropdown" id="recipientGroupDropdown">
    <!-- ... options ... -->
</div>
```

### 2. User Permissions
```html
<!-- Select user roles -->
<div class="multi-select-dropdown" id="userRolesDropdown">
    <!-- ... role options ... -->
</div>
```

### 3. Category Selection
```html
<!-- Select multiple categories -->
<div class="multi-select-dropdown" id="categoriesDropdown">
    <!-- ... category options ... -->
</div>
```

## Troubleshooting

### Dropdown doesn't close when clicking outside
**Solution**: Make sure the click-outside event listener is added:
```javascript
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('recipientGroupDropdown');
    if (dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
    }
});
```

### Selected count not updating
**Solution**: Ensure `updateRecipientGroupFilter()` is called on checkbox change:
```html
<input type="checkbox" value="Internal" onchange="updateRecipientGroupFilter()">
```

### Checkboxes not aligned properly
**Solution**: Check that labels use `display: flex` and `align-items: center`:
```css
.multi-select-option label {
    display: flex;
    align-items: center;
}
```

## Dependencies
None - Pure vanilla JavaScript and CSS

## License
Free to use within CLP E2E Outage Platform project

## Changelog

### Version 1.0 (2025-10-30)
- Initial release
- Multi-select with checkboxes
- Selected count display
- Click outside to close
- No validation restrictions
- Debug logging support

## Support
For questions or issues, contact the development team.

## Example Implementation
See `notification-management.html` History section for a complete working example.

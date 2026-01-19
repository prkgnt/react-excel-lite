---
"react-excel-lite": minor
---

### New Features

- **Keyboard Navigation**: Arrow keys to move selection, Shift+Arrow to extend selection range
- **Click Outside to Clear**: Clicking outside the grid now clears the selection
- **Edit Mode Improvements**:
  - Single click selects cell (no longer enters edit mode)
  - Double-click or Enter to enter edit mode (selects all text)
  - Type any character to enter edit mode and start typing
  - Escape to exit edit mode

### Breaking Changes

- **RowHeaderGroup Structure Changed**: Now mirrors ColHeaderGroup structure
  - Before: `{ key, label, description?, className? }`
  - After: `{ label, headers: RowHeader[], description?, className? }`
- **New RowHeader Type**: Individual row headers now use `RowHeader` interface
  - `{ key, label, description?, className? }`

### Improvements

- Added `description` field to `ColHeaderGroup` for tooltip support
- Added `description` field to `RowHeaderGroup` for tooltip support
- Row headers now support rowSpan grouping (same as column headers)

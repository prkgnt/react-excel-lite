# react-excel-lite

## 0.0.2

### Patch Changes

- 85e5481: Update description

## 1.0.0

### Major Changes

- 317df80: Add core grid components (ExcelGrid, GridCell) with Excel-like functionality
  Implement cell selection with click & drag support
  Add copy/paste functionality (Ctrl+C / Ctrl+V)
  Implement auto-fill with arithmetic sequence detection (e.g., 1,2,3 → 4,5,6)
  Add multi-directional drag fill (supports all directions, not just single axis)
  Implement customizable styling system via GridStyles interface
  Add grouped column headers (ColHeaderGroup) and row headers (RowHeaderGroup)
  Create comprehensive demo page with interactive examples
  Document peer dependencies (React >= 18.0.0, Tailwind CSS >= 3.0.0)

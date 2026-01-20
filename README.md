# react-excel-lite

[![GitHub repo](https://img.shields.io/badge/GitHub-repo-grey?logo=github)](https://github.com/prkgnt/react-excel-lite)
[![npm package](https://img.shields.io/npm/v/react-excel-lite?color=brightgreen&label=npm)](https://www.npmjs.org/package/react-excel-lite)
[![npm downloads](https://img.shields.io/npm/dw/react-excel-lite)](https://www.npmjs.org/package/react-excel-lite)
[![MIT License](https://img.shields.io/github/license/prkgnt/react-excel-lite)](https://github.com/prkgnt/react-excel-lite/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/prkgnt/react-excel-lite/pulls)

A lightweight, Excel-like editable grid component for React.

## Demo
[react-excel-lite-demo](https://prkgnt.github.io/react-excel-lite/)

## Features

- Excel-like cell selection (click & drag)
- Keyboard navigation (Arrow keys to move, Shift+Arrow to extend selection)
- Copy/Paste support (Ctrl+C / Ctrl+V)
- Auto Fill with arithmetic sequence detection (drag fill handle)
- Grouped column headers with rowSpan support
- Grouped row headers with rowSpan support
- Click outside to clear selection
- Double-click or type to edit cells
- Expandable input field when editing (text overflow handling)
- Keyboard shortcuts (Delete/Backspace to clear)
- **Styling-agnostic**: Works with Tailwind CSS, CSS Modules, plain CSS, or any styling solution
- Zero external dependencies

## Installation

```bash
npm install react-excel-lite
```

## Quick Start

```tsx
import { useState } from "react";
import { ExcelGrid } from "react-excel-lite";

function App() {
  const [data, setData] = useState([
    ["100", "200", "300"],
    ["400", "500", "600"],
    ["700", "800", "900"],
  ]);

  return <ExcelGrid data={data} onChange={setData} />;
}
```

## Props

| Prop             | Type                         | Required | Description                 |
| ---------------- | ---------------------------- | -------- | --------------------------- |
| `data`           | `string[][]`                 | Yes      | 2D array of strings         |
| `onChange`       | `(data: string[][]) => void` | Yes      | Callback when data changes  |
| `rowHeaders`     | `HeaderGroup[]`              | No       | Grouped row headers         |
| `colHeaders`     | `HeaderGroup[]`              | No       | Grouped column headers      |
| `className`      | `string`                     | No       | CSS class for container     |
| `rowHeaderTitle` | `string`                     | No       | Title for row header column |
| `styles`         | `GridStyles`                 | No       | Style configuration object  |

## With Headers

```tsx
import { useState } from "react";
import { ExcelGrid } from "react-excel-lite";
import type { HeaderGroup } from "react-excel-lite";

function App() {
  const [data, setData] = useState([
    ["100", "200", "300", "400"],
    ["500", "600", "700", "800"],
  ]);

  const colHeaders: HeaderGroup[] = [
    {
      label: "Q1",
      description: "First quarter",
      headers: [
        { key: "jan", label: "Jan", description: "January" },
        { key: "feb", label: "Feb", description: "February" },
      ],
    },
    {
      label: "Q2",
      description: "Second quarter",
      headers: [
        { key: "mar", label: "Mar", description: "March" },
        { key: "apr", label: "Apr", description: "April" },
      ],
    },
  ];

  const rowHeaders: HeaderGroup[] = [
    {
      label: "Products",
      description: "Product categories",
      headers: [
        { key: "prodA", label: "Product A", description: "Main product line" },
        { key: "prodB", label: "Product B", description: "Secondary product" },
      ],
    },
  ];

  return (
    <ExcelGrid
      data={data}
      onChange={setData}
      colHeaders={colHeaders}
      rowHeaders={rowHeaders}
      rowHeaderTitle="Category"
    />
  );
}
```

## Styling

The component comes with sensible default styles built-in. You can customize styles using the `styles` prop with CSS class strings from any styling solution.

### Default Styles

Out of the box, the grid has:
- Light gray borders and headers
- Blue selection highlight
- Blue fill handle

### Custom Styling with Tailwind CSS

```tsx
import type { GridStyles } from "react-excel-lite";

const styles: GridStyles = {
  cell: "text-sm",
  selected: "bg-purple-100 ring-2 ring-inset ring-purple-500",
  fillTarget: "bg-purple-50",
  fillHandle: "bg-purple-500",
  colGroup: "bg-purple-100 text-purple-700",
  colHeader: "bg-purple-50",
  rowHeader: "bg-slate-200",
};

<ExcelGrid data={data} onChange={setData} styles={styles} />;
```

### Custom Styling with CSS Modules

```tsx
import styles from "./grid.module.css";
import type { GridStyles } from "react-excel-lite";

const gridStyles: GridStyles = {
  selected: styles.selectedCell,
  fillTarget: styles.fillTargetCell,
  fillHandle: styles.fillHandle,
};

<ExcelGrid data={data} onChange={setData} styles={gridStyles} />;
```

### Custom Styling with Plain CSS

```tsx
const styles: GridStyles = {
  selected: "my-selected-cell",
  fillTarget: "my-fill-target",
  fillHandle: "my-fill-handle",
};

<ExcelGrid data={data} onChange={setData} styles={styles} />;
```

```css
/* styles.css */
.my-selected-cell {
  background-color: #f3e8ff;
  outline: 2px solid #a855f7;
  outline-offset: -2px;
}

.my-fill-target {
  background-color: #faf5ff;
}

.my-fill-handle {
  background-color: #a855f7;
}
```

### GridStyles Interface

```ts
interface GridStyles {
  cell?: string;       // CSS class for data cells
  selected?: string;   // CSS class for selected cells (overrides default)
  fillTarget?: string; // CSS class for fill target cells (overrides default)
  fillHandle?: string; // CSS class for fill handle (overrides default)
  colGroup?: string;   // CSS class for column group headers
  colHeader?: string;  // CSS class for individual column headers
  rowHeader?: string;  // CSS class for row headers
}
```

### Styling Individual Headers

Style individual column headers and groups:

```tsx
const colHeaders: HeaderGroup[] = [
  {
    label: "Revenue",
    className: "bg-green-100 text-green-700",
    headers: [
      { key: "q1r", label: "Q1", className: "bg-green-50" },
      { key: "q2r", label: "Q2", className: "bg-green-50" },
    ],
  },
];
```

Style individual row headers:

```tsx
const rowHeaders: HeaderGroup[] = [
  {
    label: "Regions",
    className: "bg-slate-700 text-white",
    headers: [
      { key: "regionA", label: "Region A", className: "bg-slate-600 text-white" },
      { key: "regionB", label: "Region B", className: "bg-slate-500 text-white" },
    ],
  },
];
```

## Auto Fill (Arithmetic Sequence)

Select cells with a numeric pattern and drag the fill handle to auto-fill:

- `1, 2, 3` → drag down → `4, 5, 6, 7, ...`
- `100, 200, 300` → drag down → `400, 500, 600, ...`
- `10, 8, 6` → drag down → `4, 2, 0, -2, ...`
- Text values → repeats the pattern

## Keyboard Shortcuts

| Shortcut               | Action                              |
| ---------------------- | ----------------------------------- |
| `Arrow Keys`           | Move selection                      |
| `Shift + Arrow Keys`   | Extend selection range              |
| `Enter`                | Enter edit mode (select all text)   |
| `Any character`        | Enter edit mode and start typing    |
| `Escape`               | Exit edit mode                      |
| `Ctrl+C` / `Cmd+C`     | Copy selected cells                 |
| `Ctrl+V` / `Cmd+V`     | Paste from clipboard                |
| `Delete` / `Backspace` | Clear selected cells                |

## Exports

### Components

- `ExcelGrid` - Main grid component
- `GridCell` - Individual cell component

### Hooks

- `useGridSelection` - Cell selection logic
- `useGridClipboard` - Copy/paste and keyboard navigation logic
- `useGridDragFill` - Fill handle logic

### Utilities

- `cn` - Classname merge utility
- `coordToKey` - Convert coordinate to string key
- `keyToCoord` - Convert string key to coordinate
- `getCellsInRange` - Get all cells in a range
- `isCellInRange` - Check if cell is in range
- `parseTSV` - Parse TSV string to 2D array
- `toTSV` - Convert 2D array to TSV string
- `normalizeRange` - Normalize selection range
- `getFillTargetCells` - Get fill target cells

### Types

```ts
interface CellCoord {
  row: number;
  col: number;
}

interface SelectionRange {
  start: CellCoord | null;
  end: CellCoord | null;
}

interface Header {
  key: string;
  label: string;
  description?: string;
  className?: string;
}

interface HeaderGroup {
  label: string;
  headers: Header[];
  description?: string;
  className?: string;
}

interface GridStyles {
  cell?: string;
  selected?: string;
  fillTarget?: string;
  fillHandle?: string;
  colGroup?: string;
  colHeader?: string;
  rowHeader?: string;
}

interface ExcelGridProps {
  data: string[][];
  onChange: (data: string[][]) => void;
  rowHeaders?: HeaderGroup[];
  colHeaders?: HeaderGroup[];
  className?: string;
  rowHeaderTitle?: string;
  styles?: GridStyles;
}
```

## License

MIT License © 2025 prkgnt

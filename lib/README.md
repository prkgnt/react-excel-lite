# react-excel-lite

[![GitHub repo](https://img.shields.io/badge/GitHub-repo-grey?logo=github)](https://github.com/prkgnt/react-excel-lite)
[![npm package](https://img.shields.io/npm/v/react-excel-lite?color=brightgreen&label=npm)](https://www.npmjs.org/package/react-excel-lite)
[![npm downloads](https://img.shields.io/npm/dw/react-excel-lite)](https://www.npmjs.org/package/react-excel-lite)
[![MIT License](https://img.shields.io/github/license/prkgnt/react-excel-lite)](https://github.com/prkgnt/react-excel-lite/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/prkgnt/react-excel-lite/pulls)

A lightweight, Excel-like editable grid component for React.

## Features

- Excel-like cell selection (click & drag)
- Copy/Paste support (Ctrl+C / Ctrl+V)
- Fill handle drag (auto-fill cells)
- Grouped column headers
- Row headers
- Keyboard shortcuts (Delete/Backspace to clear)
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
    [100, 200, 300],
    [400, 500, 600],
    [700, 800, 900],
  ]);

  return <ExcelGrid data={data} onChange={setData} />;
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `number[][]` | Yes | 2D array of numbers |
| `onChange` | `(data: number[][]) => void` | Yes | Callback when data changes |
| `rowHeaders` | `string[]` | No | Row header labels |
| `headerGroups` | `HeaderGroup[]` | No | Grouped column headers |
| `className` | `string` | No | Additional CSS class |
| `rowHeaderTitle` | `string` | No | Title for row header column |

## With Headers

```tsx
import { useState } from "react";
import { ExcelGrid, HeaderGroup } from "react-excel-lite";

function App() {
  const [data, setData] = useState([
    [100, 200, 300, 400],
    [500, 600, 700, 800],
  ]);

  const headerGroups: HeaderGroup[] = [
    {
      label: "Q1",
      headers: [
        { key: "jan", label: "Jan" },
        { key: "feb", label: "Feb" },
      ],
    },
    {
      label: "Q2",
      headers: [
        { key: "mar", label: "Mar" },
        { key: "apr", label: "Apr" },
      ],
    },
  ];

  const rowHeaders = ["Product A", "Product B"];

  return (
    <ExcelGrid
      data={data}
      onChange={setData}
      headerGroups={headerGroups}
      rowHeaders={rowHeaders}
      rowHeaderTitle="Product"
    />
  );
}
```

## Header with Description (Tooltip)

```tsx
const headerGroups: HeaderGroup[] = [
  {
    label: "Sales",
    headers: [
      {
        key: "revenue",
        label: "Revenue",
        description: "Total revenue including tax"
      },
      {
        key: "cost",
        label: "Cost",
        description: "Total cost of goods sold"
      },
    ],
  },
];
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` / `Cmd+C` | Copy selected cells |
| `Ctrl+V` / `Cmd+V` | Paste from clipboard |
| `Delete` / `Backspace` | Clear selected cells (set to 0) |

## Exports

### Components

- `ExcelGrid` - Main grid component
- `GridCell` - Individual cell component

### Hooks

- `useGridSelection` - Cell selection logic
- `useGridClipboard` - Copy/paste logic
- `useGridDragFill` - Fill handle logic

### Utilities

- `cn` - Classname merge utility
- `formatCurrency` - Format number with thousand separators
- `parseCurrency` - Parse formatted string to number
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

interface HeaderDefinition {
  key: string;
  label: string;
  description?: string;
}

interface HeaderGroup {
  label: string;
  headers: HeaderDefinition[];
}

interface ExcelGridProps {
  data: number[][];
  onChange: (data: number[][]) => void;
  rowHeaders?: string[];
  headerGroups?: HeaderGroup[];
  className?: string;
  rowHeaderTitle?: string;
}
```

## Styling

The component uses Tailwind CSS classes. Make sure Tailwind CSS is configured in your project, or override styles using the `className` prop.

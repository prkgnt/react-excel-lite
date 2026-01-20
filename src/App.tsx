import { useState, useCallback } from "react";
import { ExcelGrid } from "react-excel-lite";
import type { HeaderGroup, GridStyles, CellCoord } from "react-excel-lite";

function App() {
  // Selection example data
  const [selectionData, setSelectionData] = useState([
    ["A", "B", "C", "D"],
    ["E", "F", "G", "H"],
    ["I", "J", "K", "L"],
    ["M", "N", "O", "P"],
  ]);

  // Copy/Paste example data
  const [pasteData, setPasteData] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  // Auto Fill example data (vertical patterns for dragging down)
  const [fillData, setFillData] = useState([
    ["1", "100", "10"],
    ["2", "200", "8"],
    ["3", "300", "6"],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  // Advanced example data
  const [advancedData, setAdvancedData] = useState([
    ["12500", "15000", "13200", "14800", "11000", "16500"],
    ["8900", "9200", "8500", "9800", "7600", "10200"],
    ["22000", "24500", "21800", "25000", "20000", "26800"],
    ["5600", "6100", "5200", "6800", "4900", "7200"],
  ]);

  const colHeaders: HeaderGroup[] = [
    {
      label: "Q1 2025",
      description: "First quarter 2025",
      headers: [
        { key: "jan", label: "Jan", description: "January sales data" },
        { key: "feb", label: "Feb", description: "February sales data" },
        { key: "mar", label: "Mar", description: "March sales data" },
      ],
    },
    {
      label: "Q2 2025",
      description: "Second quarter 2025",
      headers: [
        { key: "apr", label: "Apr", description: "April sales data" },
        { key: "may", label: "May", description: "May sales data" },
        { key: "jun", label: "Jun", description: "June sales data" },
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
        { key: "prodC", label: "Product C", description: "Budget line" },
        { key: "prodD", label: "Product D", description: "Premium line" },
      ],
    },
  ];

  // Simple headers example (no group labels)
  const [simpleData, setSimpleData] = useState([
    ["500", "600", "700", "800"],
    ["900", "1000", "1100", "1200"],
    ["1300", "1400", "1500", "1600"],
  ]);

  const simpleColHeaders: HeaderGroup[] = [
    {
      // No label - single header row
      headers: [
        { key: "mon", label: "Mon" },
        { key: "tue", label: "Tue" },
      ],
    },
    {
      headers: [
        { key: "wed", label: "Wed" },
        { key: "thu", label: "Thu" },
      ],
    },
  ];

  const simpleRowHeaders: HeaderGroup[] = [
    {
      // No label - single header column
      headers: [
        { key: "morning", label: "Morning" },
        { key: "afternoon", label: "Afternoon" },
        { key: "evening", label: "Evening" },
      ],
    },
  ];

  // Custom styling example data
  const [styledData, setStyledData] = useState([
    ["1200", "1500", "1800", "2100"],
    ["800", "950", "1100", "1250"],
    ["2500", "2800", "3100", "3400"],
  ]);

  const styledColHeaders: HeaderGroup[] = [
    {
      label: "Revenue",
      className: "bg-emerald-100 text-emerald-700",
      headers: [
        { key: "q1r", label: "Q1", className: "bg-emerald-50" },
        { key: "q2r", label: "Q2", className: "bg-emerald-50" },
      ],
    },
    {
      label: "Cost",
      className: "bg-rose-100 text-rose-700",
      headers: [
        { key: "q1c", label: "Q1", className: "bg-rose-50" },
        { key: "q2c", label: "Q2", className: "bg-rose-50" },
      ],
    },
  ];

  const styledRowHeaders: HeaderGroup[] = [
    {
      label: "Regions",
      description: "Sales regions",
      headers: [
        {
          key: "regionA",
          label: "Region A",
          description: "North America",
          className: "bg-slate-700 text-white",
        },
        {
          key: "regionB",
          label: "Region B",
          description: "Europe",
          className: "bg-slate-600 text-white",
        },
        {
          key: "regionC",
          label: "Region C",
          description: "Asia Pacific",
          className: "bg-slate-500 text-white",
        },
      ],
    },
  ];

  // Style theme examples (using Tailwind classes for demo)
  const purpleTheme: GridStyles = {
    selected: "bg-purple-100 ring-2 ring-inset ring-purple-500",
    fillTarget: "bg-purple-50",
    fillHandle: "bg-purple-500",
  };

  const greenTheme: GridStyles = {
    selected: "bg-emerald-100 ring-2 ring-inset ring-emerald-500",
    fillTarget: "bg-emerald-50",
    fillHandle: "bg-emerald-500",
  };

  const orangeTheme: GridStyles = {
    selected: "bg-orange-100 ring-2 ring-inset ring-orange-500",
    fillTarget: "bg-orange-50",
    fillHandle: "bg-orange-500",
  };

  // Data for style demos
  const [purpleData, setPurpleData] = useState([
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["", "", ""],
  ]);

  const [greenData, setGreenData] = useState([
    ["A", "B", "C"],
    ["D", "E", "F"],
    ["", "", ""],
  ]);

  const [orangeData, setOrangeData] = useState([
    ["100", "200", "300"],
    ["400", "500", "600"],
    ["", "", ""],
  ]);

  // Cell Styles example data
  const [cellStylesData, setCellStylesData] = useState([
    ["Revenue", "1200", "1500", "1800"],
    ["Cost", "800", "950", "1100"],
    ["Profit", "400", "550", "700"],
    ["Growth", "5%", "8%", "12%"],
  ]);

  // Cell styles function - highlight first column and specific cells
  const getCellStyles = useCallback((coord: CellCoord) => {
    // First column as header style
    if (coord.col === 0) return "bg-slate-100 font-medium";
    // Highlight profit row with green
    if (coord.row === 2) return "bg-emerald-50 text-emerald-700";
    // Highlight growth row with blue
    if (coord.row === 3) return "bg-blue-50 text-blue-700";
    return undefined;
  }, []);

  // Value-based cell styles example
  const [valueStylesData, setValueStylesData] = useState([
    ["250", "-120", "800", "50"],
    ["-300", "1500", "-50", "200"],
    ["100", "450", "-200", "2000"],
  ]);

  const getValueBasedStyles = useCallback((coord: CellCoord) => {
    const value = Number(valueStylesData[coord.row]?.[coord.col]);
    if (isNaN(value)) return undefined;
    if (value < 0) return "bg-red-50 text-red-600";
    if (value >= 1000) return "bg-emerald-50 text-emerald-600 font-semibold";
    return undefined;
  }, [valueStylesData]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <header className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                react-excel
                <span className="text-emerald-400">-lite</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-md">
                Excel-like grid for React. Lightweight. Styling-agnostic.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://github.com/prkgnt/react-excel-lite"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-full hover:bg-white/20 transition-all text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
                <span className="text-slate-500 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </a>
              <a
                href="https://www.npmjs.com/package/react-excel-lite"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-5 py-3 bg-emerald-500 rounded-full hover:bg-emerald-400 transition-all text-sm font-medium text-slate-900"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z" />
                </svg>
                npm
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        {/* Installation */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Installation
          </h2>
          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <pre className="text-sm text-slate-300">
              <code>npm install react-excel-lite</code>
            </pre>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-slate-900">
                    Peer Dependency
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-slate-900">
                    Version
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-2 text-slate-700">React</td>
                  <td className="px-4 py-2">
                    <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                      {">"}= 18.0.0
                    </code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            The component comes with sensible default styles built-in. Use the{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
              styles
            </code>{" "}
            prop to customize with Tailwind, CSS Modules, or plain CSS classes.
          </p>
        </section>

        {/* Selection Test */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Selection
          </h2>
          <p className="text-slate-500 mb-4">
            Click and drag to select multiple cells. Selected cells are
            highlighted in blue.
          </p>
          <div className="bg-white rounded-lg border border-slate-200 p-6 inline-block">
            <ExcelGrid data={selectionData} onChange={setSelectionData} />
          </div>
        </section>

        {/* Copy/Paste Test */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Copy / Paste
          </h2>
          <p className="text-slate-500 mb-4">
            Select cells from the table below and paste into the grid. Use{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-xs font-mono">
              Ctrl+C
            </kbd>{" "}
            /{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-xs font-mono">
              Ctrl+V
            </kbd>
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sample data to copy */}
            <div>
              <p className="text-sm text-slate-500 mb-2">
                Sample data (select and copy):
              </p>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 px-3 py-2 text-right">
                        Apple
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-right">
                        100
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-right">
                        200
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-3 py-2 text-right">
                        Banana
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-right">
                        150
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-right">
                        250
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-3 py-2 text-right">
                        Cherry
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-right">
                        300
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-right">
                        400
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Grid to paste into */}
            <div>
              <p className="text-sm text-slate-500 mb-2">
                Grid (click a cell and paste):
              </p>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <ExcelGrid data={pasteData} onChange={setPasteData} />
              </div>
            </div>
          </div>
        </section>

        {/* Auto Fill Test */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Auto Fill (Arithmetic Sequence)
          </h2>
          <p className="text-slate-500 mb-4">
            Select cells in a column (e.g., 1, 2, 3), then drag the blue handle
            at the bottom-right corner downward.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-2">
                Try selecting each column vertically:
              </p>
              <ul className="text-sm text-slate-600 space-y-1 mb-4">
                <li>
                  Column 1:{" "}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded">
                    1, 2, 3
                  </code>{" "}
                  → 4, 5, 6
                </li>
                <li>
                  Column 2:{" "}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded">
                    100, 200, 300
                  </code>{" "}
                  → 400, 500, 600
                </li>
                <li>
                  Column 3:{" "}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded">
                    10, 8, 6
                  </code>{" "}
                  → 4, 2, 0
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <ExcelGrid data={fillData} onChange={setFillData} />
            </div>
          </div>
        </section>

        {/* Advanced Example */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            With Headers
          </h2>
          <p className="text-slate-500 mb-4">
            Grid with grouped column headers and row headers. Hover on column
            headers to see descriptions.
          </p>
          <div className="bg-white rounded-lg border border-slate-200 p-6 overflow-x-auto">
            <ExcelGrid
              data={advancedData}
              onChange={setAdvancedData}
              colHeaders={colHeaders}
              rowHeaders={rowHeaders}
              rowHeaderTitle="Product"
            />
          </div>
          <div className="mt-4 bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-slate-300">
              <code>{`const colHeaders: HeaderGroup[] = [
  {
    label: "Q1 2025",
    headers: [
      { key: "jan", label: "Jan", description: "January sales" },
      { key: "feb", label: "Feb", description: "February sales" },
      { key: "mar", label: "Mar", description: "March sales" },
    ],
  },
  // ...
];

const rowHeaders: HeaderGroup[] = [
  {
    label: "Products",
    headers: [
      { key: "prodA", label: "Product A", description: "Main product" },
      { key: "prodB", label: "Product B", description: "Secondary" },
    ],
  },
];

<ExcelGrid
  data={data}
  onChange={setData}
  colHeaders={colHeaders}
  rowHeaders={rowHeaders}
  rowHeaderTitle="Product"
/>`}</code>
            </pre>
          </div>
        </section>

        {/* Simple Headers */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Simple Headers (Without Group Labels)
          </h2>
          <p className="text-slate-500 mb-4">
            When all HeaderGroups have no{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">label</code>,
            the grid displays a single header row/column instead of two levels.
          </p>
          <div className="bg-white rounded-lg border border-slate-200 p-6 overflow-x-auto">
            <ExcelGrid
              data={simpleData}
              onChange={setSimpleData}
              colHeaders={simpleColHeaders}
              rowHeaders={simpleRowHeaders}
            />
          </div>
          <div className="mt-4 bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-slate-300">
              <code>{`const colHeaders: HeaderGroup[] = [
  {
    // No label - single header row
    headers: [
      { key: "mon", label: "Mon" },
      { key: "tue", label: "Tue" },
    ],
  },
  {
    headers: [
      { key: "wed", label: "Wed" },
      { key: "thu", label: "Thu" },
    ],
  },
];

const rowHeaders: HeaderGroup[] = [
  {
    // No label - single header column
    headers: [
      { key: "morning", label: "Morning" },
      { key: "afternoon", label: "Afternoon" },
      { key: "evening", label: "Evening" },
    ],
  },
];

<ExcelGrid
  data={data}
  onChange={setData}
  colHeaders={colHeaders}
  rowHeaders={rowHeaders}
/>`}</code>
            </pre>
          </div>
        </section>

        {/* Custom Styling */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Custom Styling
          </h2>
          <p className="text-slate-500 mb-6">
            Use the{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">styles</code>{" "}
            prop with CSS class strings to customize selection, fill target, fill handle, and headers.
            Works with Tailwind CSS, CSS Modules, or plain CSS.
          </p>

          {/* GridStyles Reference */}
          <div className="mb-8 bg-slate-800 rounded-lg p-5 overflow-x-auto">
            <h3 className="text-sm font-medium text-slate-400 mb-3">
              GridStyles Interface
            </h3>
            <pre className="text-sm text-slate-300">
              <code>{`interface GridStyles {
  cell?: string;       // CSS class for data cells
  selected?: string;   // CSS class for selected cells (overrides default)
  fillTarget?: string; // CSS class for fill target cells (overrides default)
  fillHandle?: string; // CSS class for fill handle (overrides default)
  colGroup?: string;   // CSS class for column group headers
  colHeader?: string;  // CSS class for column headers
  rowHeader?: string;  // CSS class for row headers
}`}</code>
            </pre>
          </div>

          {/* Theme Examples */}
          <h3 className="text-lg font-medium text-slate-800 mb-4">
            Color Themes (Tailwind CSS)
          </h3>
          <p className="text-slate-500 mb-4">
            Click cells to see selection styles. Drag the handle at the
            bottom-right corner to see fill styles.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Purple Theme */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm font-medium text-slate-700">
                  Purple
                </span>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <ExcelGrid
                  data={purpleData}
                  onChange={setPurpleData}
                  styles={purpleTheme}
                />
              </div>
            </div>

            {/* Green Theme */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-slate-700">
                  Green
                </span>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <ExcelGrid
                  data={greenData}
                  onChange={setGreenData}
                  styles={greenTheme}
                />
              </div>
            </div>

            {/* Orange Theme */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm font-medium text-slate-700">
                  Orange
                </span>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <ExcelGrid
                  data={orangeData}
                  onChange={setOrangeData}
                  styles={orangeTheme}
                />
              </div>
            </div>
          </div>

          <div className="mb-10 bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-slate-300">
              <code>{`// Tailwind CSS example
const purpleTheme: GridStyles = {
  selected: "bg-purple-100 ring-2 ring-inset ring-purple-500",
  fillTarget: "bg-purple-50",
  fillHandle: "bg-purple-500",
};

// CSS Modules example
import styles from "./grid.module.css";
const moduleTheme: GridStyles = {
  selected: styles.selectedCell,
  fillTarget: styles.fillTarget,
  fillHandle: styles.fillHandle,
};

// Plain CSS example
const plainTheme: GridStyles = {
  selected: "my-selected-cell",
  fillTarget: "my-fill-target",
  fillHandle: "my-fill-handle",
};`}</code>
            </pre>
          </div>

          {/* Header styling example */}
          <h3 className="text-lg font-medium text-slate-800 mb-4">
            Header Styling
          </h3>
          <p className="text-slate-500 mb-4">
            Use{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">
              className
            </code>{" "}
            on individual headers/groups for fine-grained control.
          </p>
          <div className="bg-white rounded-lg border border-slate-200 p-6 overflow-x-auto">
            <ExcelGrid
              data={styledData}
              onChange={setStyledData}
              colHeaders={styledColHeaders}
              rowHeaders={styledRowHeaders}
              rowHeaderTitle="Region"
            />
          </div>
          <div className="mt-4 bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-slate-300">
              <code>{`const colHeaders: HeaderGroup[] = [
  {
    label: "Revenue",
    className: "bg-emerald-100 text-emerald-700",  // Group style
    headers: [
      { key: "q1r", label: "Q1", className: "bg-emerald-50" },  // Individual header style
      { key: "q2r", label: "Q2", className: "bg-emerald-50" },
    ],
  },
  {
    label: "Cost",
    className: "bg-rose-100 text-rose-700",
    headers: [
      { key: "q1c", label: "Q1", className: "bg-rose-50" },
      { key: "q2c", label: "Q2", className: "bg-rose-50" },
    ],
  },
];

const rowHeaders: HeaderGroup[] = [
  {
    label: "Regions",
    headers: [
      { key: "regionA", label: "Region A", className: "bg-slate-700 text-white" },
      { key: "regionB", label: "Region B", className: "bg-slate-600 text-white" },
      { key: "regionC", label: "Region C", className: "bg-slate-500 text-white" },
    ],
  },
];`}</code>
            </pre>
          </div>

          {/* Cell Styling */}
          <h3 className="text-lg font-medium text-slate-800 mb-4 mt-10">
            Cell Styling
          </h3>
          <p className="text-slate-500 mb-4">
            Use the{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">
              cellStyles
            </code>{" "}
            prop to apply styles to specific cells based on their coordinates.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Position-based styling */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-slate-500" />
                <span className="text-sm font-medium text-slate-700">
                  Position-based
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">
                First column styled as header, rows 3-4 highlighted
              </p>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <ExcelGrid
                  data={cellStylesData}
                  onChange={setCellStylesData}
                  cellStyles={getCellStyles}
                />
              </div>
            </div>

            {/* Value-based styling */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-emerald-500" />
                <span className="text-sm font-medium text-slate-700">
                  Value-based
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">
                Negative values in red, values {">"}= 1000 in green
              </p>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <ExcelGrid
                  data={valueStylesData}
                  onChange={setValueStylesData}
                  cellStyles={getValueBasedStyles}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-slate-300">
              <code>{`import { useCallback } from "react";
import type { CellCoord } from "react-excel-lite";

// Position-based styling
const cellStyles = useCallback((coord: CellCoord) => {
  if (coord.col === 0) return "bg-slate-100 font-medium";
  if (coord.row === 2) return "bg-emerald-50 text-emerald-700";
  return undefined;
}, []);

// Value-based styling (include data in dependencies)
const cellStyles = useCallback((coord: CellCoord) => {
  const value = Number(data[coord.row]?.[coord.col]);
  if (value < 0) return "bg-red-50 text-red-600";
  if (value >= 1000) return "bg-emerald-50 text-emerald-600";
  return undefined;
}, [data]);

<ExcelGrid data={data} onChange={setData} cellStyles={cellStyles} />`}</code>
            </pre>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Keyboard Shortcuts
          </h2>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-900">
                    Shortcut
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-slate-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3">
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                      Ctrl+C
                    </kbd>{" "}
                    /{" "}
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                      Cmd+C
                    </kbd>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Copy selected cells
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                      Ctrl+V
                    </kbd>{" "}
                    /{" "}
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                      Cmd+V
                    </kbd>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Paste from clipboard
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                      Delete
                    </kbd>{" "}
                    /{" "}
                    <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                      Backspace
                    </kbd>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Clear selected cells (set to 0)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-slate-500 text-sm">
          MIT License © 2025 prkgnt
        </div>
      </footer>
    </div>
  );
}

export default App;

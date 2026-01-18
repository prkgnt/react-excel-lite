import { useState } from "react";
import { ExcelGrid } from "react-excel-lite";
import type { HeaderGroup } from "react-excel-lite";

function App() {
  // Basic example data
  const [basicData, setBasicData] = useState([
    [1000, 2000, 3000],
    [4000, 5000, 6000],
    [7000, 8000, 9000],
  ]);

  // Advanced example data
  const [advancedData, setAdvancedData] = useState([
    [12500, 15000, 13200, 14800, 11000, 16500],
    [8900, 9200, 8500, 9800, 7600, 10200],
    [22000, 24500, 21800, 25000, 20000, 26800],
    [5600, 6100, 5200, 6800, 4900, 7200],
  ]);

  const headerGroups: HeaderGroup[] = [
    {
      label: "Q1 2025",
      headers: [
        { key: "jan", label: "Jan", description: "January sales data" },
        { key: "feb", label: "Feb", description: "February sales data" },
        { key: "mar", label: "Mar", description: "March sales data" },
      ],
    },
    {
      label: "Q2 2025",
      headers: [
        { key: "apr", label: "Apr", description: "April sales data" },
        { key: "may", label: "May", description: "May sales data" },
        { key: "jun", label: "Jun", description: "June sales data" },
      ],
    },
  ];

  const rowHeaders = ["Product A", "Product B", "Product C", "Product D"];

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
                Excel-like grid for React. Lightweight. Zero dependencies.
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
        {/* Features */}
        <section className="text-center text-slate-500">
          <span>Selection</span>
          <span className="mx-2 text-slate-300">·</span>
          <span>Copy/Paste</span>
          <span className="mx-2 text-slate-300">·</span>
          <span>Auto Fill</span>
          <span className="mx-2 text-slate-300">·</span>
          <span>Headers</span>
          <span className="mx-2 text-slate-300">·</span>
          <span>Row Labels</span>
          <span className="mx-2 text-slate-300">·</span>
          <span>Keyboard Shortcuts</span>
        </section>

        {/* Basic Example */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Basic Example
          </h2>
          <p className="text-slate-500 mb-4">
            Simple grid with editable cells. Try selecting multiple cells and
            copy/paste.
          </p>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <ExcelGrid data={basicData} onChange={setBasicData} />
          </div>
          <div className="mt-4 bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-slate-300">
              <code>{`const [data, setData] = useState([
  [1000, 2000, 3000],
  [4000, 5000, 6000],
  [7000, 8000, 9000],
]);

<ExcelGrid data={data} onChange={setData} />`}</code>
            </pre>
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
              headerGroups={headerGroups}
              rowHeaders={rowHeaders}
              rowHeaderTitle="Product"
            />
          </div>
          <div className="mt-4 bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-slate-300">
              <code>{`const headerGroups: HeaderGroup[] = [
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

const rowHeaders = ["Product A", "Product B", "Product C", "Product D"];

<ExcelGrid
  data={data}
  onChange={setData}
  headerGroups={headerGroups}
  rowHeaders={rowHeaders}
  rowHeaderTitle="Product"
/>`}</code>
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

        {/* Installation */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Installation
          </h2>
          <div className="bg-slate-900 rounded-lg p-4">
            <pre className="text-sm text-slate-300">
              <code>npm install react-excel-lite</code>
            </pre>
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

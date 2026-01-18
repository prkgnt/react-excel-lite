// Components
export { ExcelGrid } from "./components/excel-grid";
export { GridCell } from "./components/grid-cell";

// Hooks
export { useGridSelection } from "./hooks/use-grid-selection";
export { useGridClipboard } from "./hooks/use-grid-clipboard";
export { useGridDragFill } from "./hooks/use-grid-drag-fill";

// Utils
export { cn } from "./utils/cn";
export { formatCurrency, parseCurrency } from "./utils/format-utils";
export {
  coordToKey,
  keyToCoord,
  getCellsInRange,
  isCellInRange,
  parseTSV,
  toTSV,
  normalizeRange,
  getFillTargetCells,
} from "./utils/grid-utils";

// Types
export type {
  CellCoord,
  SelectionRange,
  ColHeader,
  ColHeaderGroup,
  RowHeaderGroup,
  GridStyles,
  ExcelGridProps,
  GridCellProps,
} from "./types";

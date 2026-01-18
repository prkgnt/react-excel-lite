/**
 * Cell coordinate
 */
export interface CellCoord {
  row: number;
  col: number;
}

/**
 * Selection range
 */
export interface SelectionRange {
  start: CellCoord | null;
  end: CellCoord | null;
}

/**
 * Column header definition
 */
export interface ColHeader {
  key: string;
  label: string;
  description?: string;
  /** Custom class name for this header cell */
  className?: string;
}

/**
 * Column header group
 */
export interface ColHeaderGroup {
  label: string;
  headers: ColHeader[];
  /** Custom class name for this group header */
  className?: string;
}

/**
 * Row header group
 */
export interface RowHeaderGroup {
  key: string;
  label: string;
  description?: string;
  /** Custom class name for this row header */
  className?: string;
}

/**
 * Grid styles configuration
 */
export interface GridStyles {
  /** Data cell style */
  cell?: string;
  /** Selected cell style */
  selected?: string;
  /** Fill target cell style (when dragging fill handle) */
  fillTarget?: string;
  /** Fill handle style (bottom-right corner handle) */
  fillHandle?: string;
  /** Column group header style */
  colGroup?: string;
  /** Column header style */
  colHeader?: string;
  /** Row header style */
  rowHeader?: string;
}

/**
 * Grid Props
 */
export interface ExcelGridProps {
  /** 2D string array data */
  data: string[][];
  /** Data change callback */
  onChange: (data: string[][]) => void;
  /** Row header definitions (overridable per row) */
  rowHeaders?: RowHeaderGroup[];
  /** Column header group definitions */
  colHeaders?: ColHeaderGroup[];
  /** Additional class name for container */
  className?: string;
  /** Row header column title */
  rowHeaderTitle?: string;
  /** Style configuration */
  styles?: GridStyles;
}

/**
 * Cell component Props
 */
export interface GridCellProps {
  coord: CellCoord;
  value: string;
  isSelected: boolean;
  isFillTarget: boolean;
  showFillHandle: boolean;
  onMouseDown: (coord: CellCoord) => void;
  onMouseEnter: (coord: CellCoord) => void;
  onChange: (coord: CellCoord, value: string) => void;
  onFillHandleMouseDown: (coord: CellCoord) => void;
  /** Cell styles */
  styles?: Pick<GridStyles, "cell" | "selected" | "fillTarget" | "fillHandle">;
}

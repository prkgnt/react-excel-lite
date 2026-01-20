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
 * Header definition
 */
export interface Header {
  key: string;
  label: string;
  description?: string;
  /** Custom class name for this header cell */
  className?: string;
}

/**
 * Header group
 */
export interface HeaderGroup {
  label: string;
  headers: Header[];
  description?: string;
  /** Custom class name for this group header */
  className?: string;
}

/**
 * Grid styles configuration
 * All values are CSS class strings (e.g., Tailwind classes, CSS modules, or plain CSS classes)
 */
export interface GridStyles {
  /** CSS class for data cells */
  cell?: string;
  /** CSS class for selected cells (overrides default blue selection style) */
  selected?: string;
  /** CSS class for fill target cells when dragging fill handle (overrides default light blue) */
  fillTarget?: string;
  /** CSS class for fill handle at bottom-right corner (overrides default blue square) */
  fillHandle?: string;
  /** CSS class for column group headers */
  colGroup?: string;
  /** CSS class for individual column headers */
  colHeader?: string;
  /** CSS class for row headers */
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
  /** Row header group definitions */
  rowHeaders?: HeaderGroup[];
  /** Column header group definitions */
  colHeaders?: HeaderGroup[];
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

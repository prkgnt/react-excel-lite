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
export interface HeaderDefinition {
  key: string;
  label: string;
  description?: string;
}

/**
 * Header group
 */
export interface HeaderGroup {
  label: string;
  headers: HeaderDefinition[];
}

/**
 * Grid Props
 */
export interface ExcelGridProps {
  /** 2D string array data */
  data: string[][];
  /** Data change callback */
  onChange: (data: string[][]) => void;
  /** Row header labels array */
  rowHeaders?: string[];
  /** Header group definitions */
  headerGroups?: HeaderGroup[];
  /** Additional class name */
  className?: string;
  /** Row header column title */
  rowHeaderTitle?: string;
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
}

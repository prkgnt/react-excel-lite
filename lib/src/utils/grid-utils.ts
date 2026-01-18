import type { CellCoord, SelectionRange } from "../types";
import { formatCurrency, parseCurrency } from "./format-utils";

/**
 * Convert coordinate to string key
 */
export function coordToKey(coord: CellCoord): string {
  return `${coord.row}-${coord.col}`;
}

/**
 * Convert string key to coordinate
 */
export function keyToCoord(key: string): CellCoord {
  const [row, col] = key.split("-").map(Number);
  return { row, col };
}

/**
 * Get all cell coordinates between two coordinates
 */
export function getCellsInRange(
  start: CellCoord | null,
  end: CellCoord | null
): CellCoord[] {
  if (!start || !end) return start ? [start] : [];

  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);

  const cells: CellCoord[] = [];
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      cells.push({ row, col });
    }
  }
  return cells;
}

/**
 * Check if cell is within selection range
 */
export function isCellInRange(
  coord: CellCoord,
  range: SelectionRange
): boolean {
  if (!range.start) return false;

  const end = range.end || range.start;
  const minRow = Math.min(range.start.row, end.row);
  const maxRow = Math.max(range.start.row, end.row);
  const minCol = Math.min(range.start.col, end.col);
  const maxCol = Math.max(range.start.col, end.col);

  return (
    coord.row >= minRow &&
    coord.row <= maxRow &&
    coord.col >= minCol &&
    coord.col <= maxCol
  );
}

/**
 * Parse TSV (Tab-Separated Values) string - supports Excel copy
 */
export function parseTSV(text: string): number[][] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) =>
      line.split("\t").map((cell) => {
        const parsed = parseCurrency(cell.trim());
        return isNaN(parsed) ? 0 : parsed;
      })
    );
}

/**
 * Convert 2D array to TSV string
 */
export function toTSV(data: number[][]): string {
  return data
    .map((row) => row.map((v) => formatCurrency(v)).join("\t"))
    .join("\n");
}

/**
 * Normalize selection range (start is always top-left)
 */
export function normalizeRange(range: SelectionRange): SelectionRange {
  if (!range.start || !range.end) return range;

  return {
    start: {
      row: Math.min(range.start.row, range.end.row),
      col: Math.min(range.start.col, range.end.col),
    },
    end: {
      row: Math.max(range.start.row, range.end.row),
      col: Math.max(range.start.col, range.end.col),
    },
  };
}

/**
 * Calculate fill target cells (2D area support - excludes source cell)
 */
export function getFillTargetCells(
  source: CellCoord,
  target: CellCoord
): CellCoord[] {
  // source와 target이 같으면 빈 배열
  if (source.row === target.row && source.col === target.col) {
    return [];
  }

  const minRow = Math.min(source.row, target.row);
  const maxRow = Math.max(source.row, target.row);
  const minCol = Math.min(source.col, target.col);
  const maxCol = Math.max(source.col, target.col);

  const cells: CellCoord[] = [];

  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      // source 셀은 제외
      if (row === source.row && col === source.col) continue;
      cells.push({ row, col });
    }
  }

  return cells;
}

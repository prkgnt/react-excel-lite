import { useState, useCallback, useEffect } from "react";
import type { CellCoord, SelectionRange } from "../types";
import { normalizeRange } from "../utils/grid-utils";

interface UseGridDragFillProps {
  selection: SelectionRange;
  getValue: (coord: CellCoord) => string;
  setValues: (updates: { coord: CellCoord; value: string }[]) => void;
}

interface UseGridDragFillReturn {
  fillSource: CellCoord | null;
  fillTargets: CellCoord[];
  isDraggingFill: boolean;
  isFillTarget: (coord: CellCoord) => boolean;
  handleFillHandleMouseDown: (sourceCoord: CellCoord) => void;
  handleCellMouseEnterForFill: (coord: CellCoord) => void;
  handleFillMouseUp: () => void;
}

/**
 * Parse string to number, returns null if not a valid number
 */
function parseNumber(str: string): number | null {
  if (str.trim() === "") return null;
  const num = Number(str);
  return isNaN(num) ? null : num;
}

/**
 * Detect arithmetic sequence from values
 * Returns { start, diff } if valid sequence, null otherwise
 */
function detectArithmeticSequence(
  values: string[]
): { numbers: number[]; diff: number } | null {
  if (values.length === 0) return null;

  const numbers = values.map(parseNumber);

  // Check if all values are valid numbers
  if (numbers.some((n) => n === null)) return null;

  const nums = numbers as number[];

  if (nums.length === 1) {
    // Single value: diff = 0 (just copy)
    return { numbers: nums, diff: 0 };
  }

  // Calculate common difference
  const diff = nums[1] - nums[0];

  // Verify all differences are the same
  for (let i = 2; i < nums.length; i++) {
    if (nums[i] - nums[i - 1] !== diff) {
      // Not arithmetic sequence, just copy last value
      return { numbers: nums, diff: 0 };
    }
  }

  return { numbers: nums, diff };
}

export function useGridDragFill({
  selection,
  getValue,
  setValues,
}: UseGridDragFillProps): UseGridDragFillReturn {
  const [fillSource, setFillSource] = useState<CellCoord | null>(null);
  const [fillTargets, setFillTargets] = useState<CellCoord[]>([]);
  const [isDraggingFill, setIsDraggingFill] = useState(false);
  const [fillEnd, setFillEnd] = useState<CellCoord | null>(null);

  // Start fill handle drag
  const handleFillHandleMouseDown = useCallback((sourceCoord: CellCoord) => {
    setFillSource(sourceCoord);
    setIsDraggingFill(true);
    setFillTargets([]);
    setFillEnd(null);
  }, []);

  // Update targets when entering cell during drag
  const handleCellMouseEnterForFill = useCallback(
    (coord: CellCoord) => {
      if (!isDraggingFill || !selection.start) return;

      const normalized = normalizeRange(selection);
      if (!normalized.start || !normalized.end) return;

      setFillEnd(coord);

      // Calculate the extended range (selection + fill area)
      const extendedStart = {
        row: Math.min(normalized.start.row, coord.row),
        col: Math.min(normalized.start.col, coord.col),
      };
      const extendedEnd = {
        row: Math.max(normalized.end.row, coord.row),
        col: Math.max(normalized.end.col, coord.col),
      };

      // Fill targets = extended range - original selection
      const targets: CellCoord[] = [];
      for (let row = extendedStart.row; row <= extendedEnd.row; row++) {
        for (let col = extendedStart.col; col <= extendedEnd.col; col++) {
          // Skip cells that are in the original selection
          const isInSelection =
            row >= normalized.start.row &&
            row <= normalized.end.row &&
            col >= normalized.start.col &&
            col <= normalized.end.col;

          if (!isInSelection) {
            targets.push({ row, col });
          }
        }
      }

      setFillTargets(targets);
    },
    [isDraggingFill, selection]
  );

  // Apply fill values on drag end
  const handleFillMouseUp = useCallback(() => {
    if (!selection.start || fillTargets.length === 0 || !fillEnd) {
      setFillSource(null);
      setFillTargets([]);
      setIsDraggingFill(false);
      setFillEnd(null);
      return;
    }

    const normalized = normalizeRange(selection);
    if (!normalized.start || !normalized.end) {
      setFillSource(null);
      setFillTargets([]);
      setIsDraggingFill(false);
      setFillEnd(null);
      return;
    }

    const updates: { coord: CellCoord; value: string }[] = [];

    // Use non-null assertion since we already checked above
    const selStart = normalized.start!;
    const selEnd = normalized.end!;

    // Source dimensions
    const sourceRows = selEnd.row - selStart.row + 1;
    const sourceCols = selEnd.col - selStart.col + 1;

    // For each target cell, calculate value based on pattern
    fillTargets.forEach((target) => {
      // Determine which source cell to use (with wrapping)
      let sourceRow: number;
      let sourceCol: number;

      // Handle row direction
      if (target.row < selStart.row) {
        // Above selection - map backwards
        const offset = selStart.row - target.row;
        sourceRow = selEnd.row - ((offset - 1) % sourceRows);
      } else if (target.row > selEnd.row) {
        // Below selection - map forwards
        const offset = target.row - selEnd.row;
        sourceRow = selStart.row + ((offset - 1) % sourceRows);
      } else {
        sourceRow = target.row;
      }

      // Handle column direction
      if (target.col < selStart.col) {
        // Left of selection - map backwards
        const offset = selStart.col - target.col;
        sourceCol = selEnd.col - ((offset - 1) % sourceCols);
      } else if (target.col > selEnd.col) {
        // Right of selection - map forwards
        const offset = target.col - selEnd.col;
        sourceCol = selStart.col + ((offset - 1) % sourceCols);
      } else {
        sourceCol = target.col;
      }

      // Check for arithmetic sequence in the relevant direction
      let value = getValue({ row: sourceRow, col: sourceCol });

      // Try vertical sequence if target is above/below
      if (target.row !== sourceRow && target.col >= selStart.col && target.col <= selEnd.col) {
        const colValues: string[] = [];
        for (let r = selStart.row; r <= selEnd.row; r++) {
          colValues.push(getValue({ row: r, col: target.col }));
        }
        const sequence = detectArithmeticSequence(colValues);
        if (sequence && sequence.diff !== 0) {
          if (target.row > selEnd.row) {
            const steps = target.row - selEnd.row;
            value = String(sequence.numbers[sequence.numbers.length - 1] + sequence.diff * steps);
          } else if (target.row < selStart.row) {
            const steps = selStart.row - target.row;
            value = String(sequence.numbers[0] - sequence.diff * steps);
          }
        }
      }

      // Try horizontal sequence if target is left/right
      if (target.col !== sourceCol && target.row >= selStart.row && target.row <= selEnd.row) {
        const rowValues: string[] = [];
        for (let c = selStart.col; c <= selEnd.col; c++) {
          rowValues.push(getValue({ row: target.row, col: c }));
        }
        const sequence = detectArithmeticSequence(rowValues);
        if (sequence && sequence.diff !== 0) {
          if (target.col > selEnd.col) {
            const steps = target.col - selEnd.col;
            value = String(sequence.numbers[sequence.numbers.length - 1] + sequence.diff * steps);
          } else if (target.col < selStart.col) {
            const steps = selStart.col - target.col;
            value = String(sequence.numbers[0] - sequence.diff * steps);
          }
        }
      }

      updates.push({ coord: target, value });
    });

    if (updates.length > 0) {
      setValues(updates);
    }

    setFillSource(null);
    setFillTargets([]);
    setIsDraggingFill(false);
    setFillEnd(null);
  }, [selection, fillTargets, fillEnd, getValue, setValues]);

  // Check if cell is fill target
  const isFillTarget = useCallback(
    (coord: CellCoord) => {
      return fillTargets.some(
        (t) => t.row === coord.row && t.col === coord.col
      );
    },
    [fillTargets]
  );

  // Global mouseup event listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingFill) {
        handleFillMouseUp();
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDraggingFill, handleFillMouseUp]);

  return {
    fillSource,
    fillTargets,
    isDraggingFill,
    isFillTarget,
    handleFillHandleMouseDown,
    handleCellMouseEnterForFill,
    handleFillMouseUp,
  };
}

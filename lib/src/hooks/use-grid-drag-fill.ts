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
  const [dragDirection, setDragDirection] = useState<
    "down" | "up" | "right" | "left" | null
  >(null);

  // Start fill handle drag
  const handleFillHandleMouseDown = useCallback((sourceCoord: CellCoord) => {
    setFillSource(sourceCoord);
    setIsDraggingFill(true);
    setFillTargets([]);
    setDragDirection(null);
  }, []);

  // Update targets when entering cell during drag
  const handleCellMouseEnterForFill = useCallback(
    (coord: CellCoord) => {
      if (!isDraggingFill || !selection.start) return;

      const normalized = normalizeRange(selection);
      if (!normalized.start || !normalized.end) return;

      // Determine drag direction based on cursor position relative to selection
      let direction: "down" | "up" | "right" | "left" | null = null;

      if (coord.row > normalized.end.row) {
        direction = "down";
      } else if (coord.row < normalized.start.row) {
        direction = "up";
      } else if (coord.col > normalized.end.col) {
        direction = "right";
      } else if (coord.col < normalized.start.col) {
        direction = "left";
      }

      setDragDirection(direction);

      // Calculate fill targets based on direction
      let targets: CellCoord[] = [];

      if (direction === "down") {
        for (
          let row = normalized.end.row + 1;
          row <= coord.row;
          row++
        ) {
          for (
            let col = normalized.start.col;
            col <= normalized.end.col;
            col++
          ) {
            targets.push({ row, col });
          }
        }
      } else if (direction === "up") {
        for (let row = normalized.start.row - 1; row >= coord.row; row--) {
          for (
            let col = normalized.start.col;
            col <= normalized.end.col;
            col++
          ) {
            targets.push({ row, col });
          }
        }
      } else if (direction === "right") {
        for (
          let col = normalized.end.col + 1;
          col <= coord.col;
          col++
        ) {
          for (
            let row = normalized.start.row;
            row <= normalized.end.row;
            row++
          ) {
            targets.push({ row, col });
          }
        }
      } else if (direction === "left") {
        for (let col = normalized.start.col - 1; col >= coord.col; col--) {
          for (
            let row = normalized.start.row;
            row <= normalized.end.row;
            row++
          ) {
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
    if (!selection.start || fillTargets.length === 0) {
      setFillSource(null);
      setFillTargets([]);
      setIsDraggingFill(false);
      setDragDirection(null);
      return;
    }

    const normalized = normalizeRange(selection);
    if (!normalized.start || !normalized.end) {
      setFillSource(null);
      setFillTargets([]);
      setIsDraggingFill(false);
      setDragDirection(null);
      return;
    }

    const updates: { coord: CellCoord; value: string }[] = [];

    // Determine if we're filling by row or column
    const isVertical = dragDirection === "down" || dragDirection === "up";
    const isReverse = dragDirection === "up" || dragDirection === "left";

    if (isVertical) {
      // For each column, get source values and apply pattern
      for (
        let col = normalized.start.col;
        col <= normalized.end.col;
        col++
      ) {
        const sourceValues: string[] = [];
        for (
          let row = normalized.start.row;
          row <= normalized.end.row;
          row++
        ) {
          sourceValues.push(getValue({ row, col }));
        }

        const sequence = detectArithmeticSequence(sourceValues);
        const targetCells = fillTargets.filter((t) => t.col === col);

        if (isReverse) {
          targetCells.reverse();
        }

        targetCells.forEach((target, index) => {
          let value: string;

          if (sequence && sequence.diff !== 0) {
            // Arithmetic sequence
            const lastNum = isReverse
              ? sequence.numbers[0]
              : sequence.numbers[sequence.numbers.length - 1];
            const newNum = isReverse
              ? lastNum - sequence.diff * (index + 1)
              : lastNum + sequence.diff * (index + 1);
            value = String(newNum);
          } else {
            // Just repeat the pattern
            const patternIndex = index % sourceValues.length;
            const actualIndex = isReverse
              ? sourceValues.length - 1 - patternIndex
              : patternIndex;
            value = sourceValues[actualIndex];
          }

          updates.push({ coord: target, value });
        });
      }
    } else {
      // Horizontal fill - for each row
      for (
        let row = normalized.start.row;
        row <= normalized.end.row;
        row++
      ) {
        const sourceValues: string[] = [];
        for (
          let col = normalized.start.col;
          col <= normalized.end.col;
          col++
        ) {
          sourceValues.push(getValue({ row, col }));
        }

        const sequence = detectArithmeticSequence(sourceValues);
        const targetCells = fillTargets.filter((t) => t.row === row);

        if (isReverse) {
          targetCells.reverse();
        }

        targetCells.forEach((target, index) => {
          let value: string;

          if (sequence && sequence.diff !== 0) {
            // Arithmetic sequence
            const lastNum = isReverse
              ? sequence.numbers[0]
              : sequence.numbers[sequence.numbers.length - 1];
            const newNum = isReverse
              ? lastNum - sequence.diff * (index + 1)
              : lastNum + sequence.diff * (index + 1);
            value = String(newNum);
          } else {
            // Just repeat the pattern
            const patternIndex = index % sourceValues.length;
            const actualIndex = isReverse
              ? sourceValues.length - 1 - patternIndex
              : patternIndex;
            value = sourceValues[actualIndex];
          }

          updates.push({ coord: target, value });
        });
      }
    }

    if (updates.length > 0) {
      setValues(updates);
    }

    setFillSource(null);
    setFillTargets([]);
    setIsDraggingFill(false);
    setDragDirection(null);
  }, [selection, fillTargets, dragDirection, getValue, setValues]);

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

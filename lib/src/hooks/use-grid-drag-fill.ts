import { useState, useCallback, useEffect } from "react";
import type { CellCoord } from "../types";
import { getFillTargetCells } from "../utils/grid-utils";

interface UseGridDragFillProps {
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

export function useGridDragFill({
  getValue,
  setValues,
}: UseGridDragFillProps): UseGridDragFillReturn {
  const [fillSource, setFillSource] = useState<CellCoord | null>(null);
  const [fillTargets, setFillTargets] = useState<CellCoord[]>([]);
  const [isDraggingFill, setIsDraggingFill] = useState(false);

  // Start fill handle drag
  const handleFillHandleMouseDown = useCallback((sourceCoord: CellCoord) => {
    setFillSource(sourceCoord);
    setIsDraggingFill(true);
    setFillTargets([]);
  }, []);

  // Update targets when entering cell during drag (2D area support)
  const handleCellMouseEnterForFill = useCallback(
    (coord: CellCoord) => {
      if (!isDraggingFill || !fillSource) return;

      const targets = getFillTargetCells(fillSource, coord);
      setFillTargets(targets);
    },
    [isDraggingFill, fillSource]
  );

  // Apply fill values on drag end
  const handleFillMouseUp = useCallback(() => {
    if (fillSource && fillTargets.length > 0) {
      const sourceValue = getValue(fillSource);
      // Collect all target cells as array and update at once
      const updates = fillTargets.map((target) => ({
        coord: target,
        value: sourceValue,
      }));
      setValues(updates);
    }

    setFillSource(null);
    setFillTargets([]);
    setIsDraggingFill(false);
  }, [fillSource, fillTargets, getValue, setValues]);

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

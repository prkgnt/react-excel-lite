import { useState, useCallback, useEffect } from "react";
import type { CellCoord, SelectionRange } from "../types";
import { isCellInRange } from "../utils/grid-utils";

interface UseGridSelectionReturn {
  selection: SelectionRange;
  isSelecting: boolean;
  isCellSelected: (coord: CellCoord) => boolean;
  handleCellMouseDown: (coord: CellCoord) => void;
  handleCellMouseEnter: (coord: CellCoord) => void;
  handleMouseUp: () => void;
  clearSelection: () => void;
  setSelection: (range: SelectionRange) => void;
}

export function useGridSelection(): UseGridSelectionReturn {
  const [selection, setSelection] = useState<SelectionRange>({
    start: null,
    end: null,
  });
  const [isSelecting, setIsSelecting] = useState(false);

  // Start selection on cell click
  const handleCellMouseDown = useCallback((coord: CellCoord) => {
    setSelection({ start: coord, end: coord });
    setIsSelecting(true);
  }, []);

  // Extend range on mouse move
  const handleCellMouseEnter = useCallback(
    (coord: CellCoord) => {
      if (isSelecting) {
        setSelection((prev) => ({ ...prev, end: coord }));
      }
    },
    [isSelecting]
  );

  // Complete selection
  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelection({ start: null, end: null });
    setIsSelecting(false);
  }, []);

  // Check if cell is selected
  const isCellSelected = useCallback(
    (coord: CellCoord) => isCellInRange(coord, selection),
    [selection]
  );

  // Global mouseup event listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isSelecting]);

  return {
    selection,
    isSelecting,
    isCellSelected,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleMouseUp,
    clearSelection,
    setSelection,
  };
}

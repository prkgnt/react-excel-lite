import { useCallback } from "react";
import type { CellCoord, SelectionRange } from "../types";
import { normalizeRange, parseTSV, toTSV } from "../utils/grid-utils";

interface UseGridClipboardProps {
  selection: SelectionRange;
  getValue: (coord: CellCoord) => string;
  setValues: (updates: { coord: CellCoord; value: string }[]) => void;
  rowCount: number;
  colCount: number;
}

interface UseGridClipboardReturn {
  handleCopy: () => Promise<void>;
  handlePaste: () => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export function useGridClipboard({
  selection,
  getValue,
  setValues,
  rowCount,
  colCount,
}: UseGridClipboardProps): UseGridClipboardReturn {
  // Extract selected cell data as 2D array
  const getSelectedData = useCallback((): string[][] => {
    const normalized = normalizeRange(selection);
    if (!normalized.start || !normalized.end) return [];

    const data: string[][] = [];
    for (let row = normalized.start.row; row <= normalized.end.row; row++) {
      const rowData: string[] = [];
      for (let col = normalized.start.col; col <= normalized.end.col; col++) {
        rowData.push(getValue({ row, col }));
      }
      data.push(rowData);
    }
    return data;
  }, [selection, getValue]);

  // Copy
  const handleCopy = useCallback(async () => {
    const data = getSelectedData();
    if (data.length === 0) return;

    const tsv = toTSV(data);
    try {
      await navigator.clipboard.writeText(tsv);
    } catch (error) {
      console.error("Clipboard copy failed:", error);
    }
  }, [getSelectedData]);

  // Paste
  const handlePaste = useCallback(async () => {
    if (!selection.start) return;

    try {
      const text = await navigator.clipboard.readText();
      const data = parseTSV(text);

      if (data.length === 0) return;

      const startRow = selection.start.row;
      const startCol = selection.start.col;

      // Collect cells to update as array
      const updates: { coord: CellCoord; value: string }[] = [];

      // Check paste range (prevent exceeding grid bounds)
      data.forEach((rowData, rowOffset) => {
        const targetRow = startRow + rowOffset;
        if (targetRow >= rowCount) return;

        rowData.forEach((value, colOffset) => {
          const targetCol = startCol + colOffset;
          if (targetCol >= colCount) return;

          updates.push({ coord: { row: targetRow, col: targetCol }, value });
        });
      });

      // Update all cells at once
      if (updates.length > 0) {
        setValues(updates);
      }
    } catch (error) {
      console.error("Clipboard paste failed:", error);
    }
  }, [selection.start, setValues, rowCount, colCount]);

  // Delete selection (reset to empty string)
  const handleDelete = useCallback(() => {
    const normalized = normalizeRange(selection);
    if (!normalized.start || !normalized.end) return;

    const updates: { coord: CellCoord; value: string }[] = [];

    for (let row = normalized.start.row; row <= normalized.end.row; row++) {
      for (let col = normalized.start.col; col <= normalized.end.col; col++) {
        updates.push({ coord: { row, col }, value: "" });
      }
    }

    if (updates.length > 0) {
      setValues(updates);
    }
  }, [selection, setValues]);

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Ctrl+C / Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
        handleCopy();
      }

      // Ctrl+V / Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        e.preventDefault();
        handlePaste();
      }

      // Backspace / Delete - delete selection
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        handleDelete();
      }
    },
    [handleCopy, handlePaste, handleDelete]
  );

  return {
    handleCopy,
    handlePaste,
    handleKeyDown,
  };
}

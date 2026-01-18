import { useCallback, useRef, useMemo } from "react";
import { cn } from "../utils/cn";
import type { ExcelGridProps, CellCoord } from "../types";
import { useGridSelection } from "../hooks/use-grid-selection";
import { useGridClipboard } from "../hooks/use-grid-clipboard";
import { useGridDragFill } from "../hooks/use-grid-drag-fill";
import { normalizeRange } from "../utils/grid-utils";
import { GridCell } from "./grid-cell";

export function ExcelGrid({
  data,
  onChange,
  rowHeaders,
  headerGroups,
  className,
  rowHeaderTitle = "",
}: ExcelGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate grid size
  const rowCount = data.length;
  const colCount = useMemo(() => {
    if (headerGroups) {
      return headerGroups.reduce(
        (sum, group) => sum + group.headers.length,
        0
      );
    }
    return data[0]?.length ?? 0;
  }, [headerGroups, data]);

  // Flatten all headers
  const flatHeaders = useMemo(() => {
    if (!headerGroups) return [];
    return headerGroups.flatMap((group) => group.headers);
  }, [headerGroups]);

  // Get value from grid coordinate
  const getValue = useCallback(
    (coord: CellCoord): string => {
      if (coord.row < 0 || coord.row >= rowCount) return "";
      if (coord.col < 0 || coord.col >= colCount) return "";
      return data[coord.row]?.[coord.col] ?? "";
    },
    [data, rowCount, colCount]
  );

  // Set single cell value
  const setValue = useCallback(
    (coord: CellCoord, value: string) => {
      const newData = data.map((row, rowIndex) =>
        rowIndex === coord.row
          ? row.map((cell, colIndex) =>
              colIndex === coord.col ? value : cell
            )
          : row
      );
      onChange(newData);
    },
    [data, onChange]
  );

  // Set multiple cell values at once (batch update)
  const setValues = useCallback(
    (updates: { coord: CellCoord; value: string }[]) => {
      if (updates.length === 0) return;

      const newData = data.map((row) => [...row]);

      updates.forEach(({ coord, value }) => {
        if (
          coord.row >= 0 &&
          coord.row < rowCount &&
          coord.col >= 0 &&
          coord.col < colCount
        ) {
          newData[coord.row][coord.col] = value;
        }
      });

      onChange(newData);
    },
    [data, onChange, rowCount, colCount]
  );

  // Initialize hooks
  const {
    selection,
    isSelecting,
    isCellSelected,
    handleCellMouseDown,
    handleCellMouseEnter,
  } = useGridSelection();

  const { handleKeyDown } = useGridClipboard({
    selection,
    getValue,
    setValues,
    rowCount,
    colCount,
  });

  const {
    isDraggingFill,
    isFillTarget,
    handleFillHandleMouseDown,
    handleCellMouseEnterForFill,
  } = useGridDragFill({
    selection,
    getValue,
    setValues,
  });

  // Cell mouse enter handler (handles both selection and fill)
  const handleCellEnter = useCallback(
    (coord: CellCoord) => {
      if (isDraggingFill) {
        handleCellMouseEnterForFill(coord);
      } else if (isSelecting) {
        handleCellMouseEnter(coord);
      }
    },
    [
      isDraggingFill,
      isSelecting,
      handleCellMouseEnterForFill,
      handleCellMouseEnter,
    ]
  );

  // Cell value change handler
  const handleCellChange = useCallback(
    (coord: CellCoord, inputValue: string) => {
      setValue(coord, inputValue);
    },
    [setValue]
  );

  // Check if current cell is the bottom-right of selection (for fill handle display)
  const isBottomRightCell = useCallback(
    (coord: CellCoord): boolean => {
      if (!selection.start) return false;
      const normalized = normalizeRange(selection);
      if (!normalized.start || !normalized.end) return false;
      return (
        coord.row === normalized.end.row && coord.col === normalized.end.col
      );
    },
    [selection]
  );

  return (
    <div
      ref={containerRef}
      className={cn("outline-none overflow-x-auto", className)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <table className="border-collapse text-xs select-none">
        <thead>
          {/* Group header row */}
          {headerGroups && (
            <tr>
              {/* Row header column */}
              {rowHeaders && (
                <th className="sticky left-0 z-10 bg-gray-100 border border-gray-300 px-2 py-1.5 text-center font-medium">
                  {rowHeaderTitle}
                </th>
              )}
              {/* Group headers */}
              {headerGroups.map((group, groupIndex) => (
                <th
                  key={groupIndex}
                  colSpan={group.headers.length}
                  className="bg-blue-100 border border-gray-300 px-1 py-1.5 text-center font-medium text-blue-700"
                >
                  {group.label}
                </th>
              ))}
            </tr>
          )}
          {/* Individual header row */}
          {headerGroups && (
            <tr>
              {/* Empty cell */}
              {rowHeaders && (
                <th className="sticky left-0 z-10 bg-gray-100 border border-gray-300 px-2 py-1"></th>
              )}
              {/* Individual headers */}
              {flatHeaders.map((header) => (
                <th
                  key={header.key}
                  className="bg-gray-50 border border-gray-300 px-1 py-1 text-center font-medium text-[11px]"
                  title={header.description}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* Row header */}
              {rowHeaders && (
                <td className="sticky left-0 z-10 bg-gray-100 border border-gray-300 px-1 py-1.5 text-center font-medium">
                  {rowHeaders[rowIndex]}
                </td>
              )}
              {/* Data cells */}
              {row.map((_, colIndex) => {
                const coord = { row: rowIndex, col: colIndex };
                const isSelected = isCellSelected(coord);
                const isFill = isFillTarget(coord);
                const isBottomRight = isBottomRightCell(coord);

                return (
                  <GridCell
                    key={colIndex}
                    coord={coord}
                    value={getValue(coord)}
                    isSelected={isSelected}
                    isFillTarget={isFill}
                    showFillHandle={isBottomRight && !isDraggingFill}
                    onMouseDown={handleCellMouseDown}
                    onMouseEnter={handleCellEnter}
                    onChange={handleCellChange}
                    onFillHandleMouseDown={handleFillHandleMouseDown}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

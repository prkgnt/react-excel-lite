import { useCallback, useRef, useMemo } from "react";
import type { CSSProperties } from "react";
import { cn } from "../utils/cn";
import type { ExcelGridProps, CellCoord } from "../types";
import { useGridSelection } from "../hooks/use-grid-selection";
import { useGridClipboard } from "../hooks/use-grid-clipboard";
import { useGridDragFill } from "../hooks/use-grid-drag-fill";
import { normalizeRange } from "../utils/grid-utils";
import { GridCell } from "./grid-cell";

// Base layout styles (always applied)
const containerBaseStyle: CSSProperties = {
  outline: "none",
  overflowX: "auto",
};

const tableBaseStyle: CSSProperties = {
  borderCollapse: "collapse",
  fontSize: "12px",
  userSelect: "none",
};

// Layout-only styles for headers (always applied)
const rowHeaderLayoutStyle: CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 10,
  border: "1px solid #d1d5db",
  padding: "6px 8px",
  textAlign: "center",
  fontWeight: 500,
};

const colGroupLayoutStyle: CSSProperties = {
  border: "1px solid #d1d5db",
  padding: "6px 4px",
  textAlign: "center",
  fontWeight: 500,
};

const colHeaderLayoutStyle: CSSProperties = {
  border: "1px solid #d1d5db",
  padding: "4px",
  textAlign: "center",
  fontWeight: 500,
  fontSize: "11px",
};

// Visual styles (only applied when no custom className)
const rowHeaderVisualStyle: CSSProperties = {
  backgroundColor: "#f3f4f6",
};

const colGroupVisualStyle: CSSProperties = {
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
};

const colHeaderVisualStyle: CSSProperties = {
  backgroundColor: "#f9fafb",
};

// Type for flattened row header info
interface FlatRowHeaderInfo {
  groupIndex: number;
  isFirstInGroup: boolean;
  groupLabel?: string;
  groupRowCount: number;
  rowHeader: { key: string; label: string; description?: string; className?: string };
  groupClassName?: string;
  groupDescription?: string;
}

export function ExcelGrid({
  data,
  onChange,
  rowHeaders,
  colHeaders,
  className,
  rowHeaderTitle = "",
  styles,
  cellStyles,
}: ExcelGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate grid size
  const rowCount = data.length;
  const colCount = useMemo(() => {
    if (colHeaders) {
      return colHeaders.reduce(
        (sum, group) => sum + group.headers.length,
        0
      );
    }
    return data[0]?.length ?? 0;
  }, [colHeaders, data]);

  // Flatten all headers
  const flatHeaders = useMemo(() => {
    if (!colHeaders) return [];
    return colHeaders.flatMap((group) => group.headers);
  }, [colHeaders]);

  // Check if any group has a label (for conditional rendering of group row/column)
  const hasColGroupLabels = useMemo(() => {
    if (!colHeaders) return false;
    return colHeaders.some((group) => group.label !== undefined);
  }, [colHeaders]);

  const hasRowGroupLabels = useMemo(() => {
    if (!rowHeaders) return false;
    return rowHeaders.some((group) => group.label !== undefined);
  }, [rowHeaders]);

  // Flatten row header groups for rowSpan rendering
  const flatRowHeaders = useMemo((): FlatRowHeaderInfo[] | null => {
    if (!rowHeaders) return null;
    const result: FlatRowHeaderInfo[] = [];
    rowHeaders.forEach((group, groupIndex) => {
      group.headers.forEach((header, headerIndex) => {
        result.push({
          groupIndex,
          isFirstInGroup: headerIndex === 0,
          groupLabel: group.label,
          groupRowCount: group.headers.length,
          rowHeader: header,
          groupClassName: group.className,
          groupDescription: group.description,
        });
      });
    });
    return result;
  }, [rowHeaders]);

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
    setSelection,
  } = useGridSelection({ containerRef });

  const { handleKeyDown } = useGridClipboard({
    selection,
    getValue,
    setValues,
    setSelection,
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

  // Build header styles: layout + visual (only if no custom className)
  const getRowHeaderStyle = (customClassName?: string): CSSProperties => ({
    ...rowHeaderLayoutStyle,
    ...(!customClassName && !styles?.rowHeader ? rowHeaderVisualStyle : {}),
  });

  const getColGroupStyle = (customClassName?: string): CSSProperties => ({
    ...colGroupLayoutStyle,
    ...(!customClassName && !styles?.colGroup ? colGroupVisualStyle : {}),
  });

  const getColHeaderStyle = (customClassName?: string): CSSProperties => ({
    ...colHeaderLayoutStyle,
    ...(!customClassName && !styles?.colHeader ? colHeaderVisualStyle : {}),
  });

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerBaseStyle}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <table style={tableBaseStyle}>
        <thead>
          {/* Group header row (only rendered if any group has a label) */}
          {colHeaders && hasColGroupLabels && (
            <tr>
              {/* Row header column(s) */}
              {rowHeaders && (
                <th
                  colSpan={hasRowGroupLabels ? 2 : 1}
                  className={styles?.rowHeader}
                  style={getRowHeaderStyle()}
                >
                  {rowHeaderTitle}
                </th>
              )}
              {/* Group headers */}
              {colHeaders.map((group, groupIndex) => (
                <th
                  key={groupIndex}
                  colSpan={group.headers.length}
                  className={cn(styles?.colGroup, group.className)}
                  style={getColGroupStyle(group.className)}
                  title={group.description}
                >
                  {group.label ?? ""}
                </th>
              ))}
            </tr>
          )}
          {/* Individual header row */}
          {colHeaders && (
            <tr>
              {/* Empty cell(s) for row headers */}
              {rowHeaders && (
                <th
                  colSpan={hasRowGroupLabels ? 2 : 1}
                  className={styles?.rowHeader}
                  style={getRowHeaderStyle()}
                >
                  {!hasColGroupLabels && rowHeaderTitle}
                </th>
              )}
              {/* Individual headers */}
              {flatHeaders.map((header) => (
                <th
                  key={header.key}
                  className={cn(styles?.colHeader, header.className)}
                  style={getColHeaderStyle(header.className)}
                  title={header.description}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const rowHeaderInfo = flatRowHeaders?.[rowIndex];
            return (
            <tr key={rowIndex}>
              {/* Row headers with rowSpan */}
              {rowHeaderInfo && (
                <>
                  {hasRowGroupLabels && rowHeaderInfo.isFirstInGroup && (
                    <td
                      rowSpan={rowHeaderInfo.groupRowCount}
                      className={cn(styles?.rowHeader, rowHeaderInfo.groupClassName)}
                      style={getRowHeaderStyle(rowHeaderInfo.groupClassName)}
                      title={rowHeaderInfo.groupDescription}
                    >
                      {rowHeaderInfo.groupLabel ?? ""}
                    </td>
                  )}
                  <td
                    className={cn(styles?.rowHeader, rowHeaderInfo.rowHeader.className)}
                    style={getRowHeaderStyle(rowHeaderInfo.rowHeader.className)}
                    title={rowHeaderInfo.rowHeader.description}
                  >
                    {rowHeaderInfo.rowHeader.label}
                  </td>
                </>
              )}
              {/* Data cells */}
              {row.map((_, colIndex) => {
                const coord = { row: rowIndex, col: colIndex };
                const isSelected = isCellSelected(coord);
                const isFill = isFillTarget(coord);
                const isBottomRight = isBottomRightCell(coord);
                const cellClassName = cellStyles?.(coord);

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
                    styles={styles}
                    cellClassName={cellClassName}
                    colCount={colCount}
                  />
                );
              })}
            </tr>
          );
          })}
        </tbody>
      </table>
    </div>
  );
}

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { cn } from "../utils/cn";
import type { GridCellProps } from "../types";
import type { CSSProperties } from "react";

// Base styles for cells
const cellBaseStyle: CSSProperties = {
  position: "relative",
  border: "1px solid #d1d5db",
  padding: 0,
  height: "28px",
  minWidth: "80px",
};

const inputBaseStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  padding: "4px",
  textAlign: "right",
  fontSize: "12px",
  boxSizing: "border-box",
  cursor: "cell",
  backgroundColor: "transparent",
  outline: "none",
  border: "none",
};

const fillHandleBaseStyle: CSSProperties = {
  position: "absolute",
  bottom: "-2px",
  right: "-2px",
  width: "8px",
  height: "8px",
  cursor: "crosshair",
  zIndex: 20,
  backgroundColor: "#3b82f6",
};

// Overlay input container base style (for editing mode)
const overlayContainerBaseStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  minWidth: "100%",
  height: "100%",
  zIndex: 30,
};

const overlayInputStyle: CSSProperties = {
  height: "100%",
  padding: "4px",
  textAlign: "right",
  fontSize: "12px",
  boxSizing: "border-box",
  backgroundColor: "#fff",
  border: "2px solid #3b82f6",
  outline: "none",
  minWidth: "100%",
};

// Hidden span style for measuring text width
const measureSpanStyle: CSSProperties = {
  position: "absolute",
  visibility: "hidden",
  whiteSpace: "pre",
  fontSize: "12px",
  padding: "4px",
};

// Default styles when user doesn't provide custom styles
const selectedDefaultStyle: CSSProperties = {
  backgroundColor: "#dbeafe",
  outline: "2px solid #3b82f6",
  outlineOffset: "-2px",
};

const fillTargetDefaultStyle: CSSProperties = {
  backgroundColor: "#eff6ff",
};

export function GridCell({
  coord,
  value,
  isSelected,
  isFillTarget,
  showFillHandle,
  onMouseDown,
  onMouseEnter,
  onChange,
  onFillHandleMouseDown,
  styles,
  cellClassName,
  colCount,
}: GridCellProps) {
  // Determine expansion direction based on cell position
  // Cells in the right half expand to the left, cells in the left half expand to the right
  const expandToLeft = coord.col >= colCount / 2;
  const [isEditing, setIsEditing] = useState(false);
  const [shouldSelect, setShouldSelect] = useState(false);
  const [inputWidth, setInputWidth] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const measureSpanRef = useRef<HTMLSpanElement>(null);
  const cellRef = useRef<HTMLTableCellElement>(null);

  // Measure text width and update input width
  useLayoutEffect(() => {
    if (isEditing && measureSpanRef.current && cellRef.current) {
      const textWidth = measureSpanRef.current.offsetWidth;
      const cellWidth = cellRef.current.offsetWidth;
      // Use larger of text width or cell width, with some padding
      setInputWidth(Math.max(textWidth + 16, cellWidth));
    }
  }, [isEditing, value]);

  // Focus overlay input when entering edit mode
  useEffect(() => {
    if (isEditing && overlayInputRef.current) {
      overlayInputRef.current.focus();
      if (shouldSelect) {
        overlayInputRef.current.select();
        setShouldSelect(false);
      }
    } else if (isSelected && !isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected, isEditing, shouldSelect]);

  // Exit edit mode when cell is deselected
  useEffect(() => {
    if (!isSelected && isEditing) {
      setIsEditing(false);
      setInputWidth(null);
    }
  }, [isSelected, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(coord, e.target.value);
  };

  const handleMouseDownCell = (e: React.MouseEvent) => {
    // Start selection only when not clicking fill handle
    if (!(e.target as HTMLElement).classList.contains("fill-handle")) {
      onMouseDown(coord);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setShouldSelect(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEditing) {
      // In edit mode: Enter or Escape exits edit mode
      if (e.key === "Enter" || e.key === "Escape") {
        setIsEditing(false);
      }
    } else {
      // In readOnly mode: Enter or printable key enters edit mode
      if (e.key === "Enter") {
        e.preventDefault();
        setIsEditing(true);
        setShouldSelect(true);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        // Printable character: enter edit mode and replace with typed char
        e.preventDefault();
        onChange(coord, e.key);
        setIsEditing(true);
      }
    }
  };

  const handleFillHandleDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFillHandleMouseDown(coord);
  };

  // Determine if we should use default inline styles or user className
  const hasCustomSelected = !!styles?.selected;
  const hasCustomFillTarget = !!styles?.fillTarget;
  const hasCustomFillHandle = !!styles?.fillHandle;

  // Build cell style: base + conditional default styles
  const cellStyle: CSSProperties = {
    ...cellBaseStyle,
    ...(isSelected && !hasCustomSelected ? selectedDefaultStyle : {}),
    ...(isFillTarget && !hasCustomFillTarget ? fillTargetDefaultStyle : {}),
  };

  // Build fill handle style
  const fillHandleStyle: CSSProperties = {
    ...fillHandleBaseStyle,
    ...(hasCustomFillHandle ? { backgroundColor: undefined } : {}),
  };

  // Input style with overflow hidden for non-editing state
  const currentInputStyle: CSSProperties = {
    ...inputBaseStyle,
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <td
      ref={cellRef}
      className={cn(
        styles?.cell,
        isSelected && styles?.selected,
        isFillTarget && styles?.fillTarget,
        cellClassName
      )}
      style={cellStyle}
      onMouseDown={handleMouseDownCell}
      onMouseEnter={() => onMouseEnter(coord)}
      onDoubleClick={handleDoubleClick}
    >
      {/* Base input - maintains layout, shows truncated text when not editing */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        readOnly
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={currentInputStyle}
        tabIndex={isEditing ? -1 : 0}
      />

      {/* Overlay input - appears when editing, expands to fit content */}
      {isEditing && (
        <div
          style={{
            ...overlayContainerBaseStyle,
            ...(expandToLeft ? { right: 0 } : { left: 0 }),
          }}
        >
          <input
            ref={overlayInputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              ...overlayInputStyle,
              width: inputWidth ?? "100%",
              textAlign: expandToLeft ? "right" : "left",
            }}
          />
        </div>
      )}

      {/* Hidden span for measuring text width */}
      {isEditing && (
        <span ref={measureSpanRef} style={measureSpanStyle}>
          {value}
        </span>
      )}

      {/* Fill handle */}
      {showFillHandle && (
        <div
          className={cn("fill-handle", styles?.fillHandle)}
          style={fillHandleStyle}
          onMouseDown={handleFillHandleDown}
        />
      )}
    </td>
  );
}

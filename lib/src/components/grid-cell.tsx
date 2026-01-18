import { cn } from "../utils/cn";
import type { GridCellProps } from "../types";
import type { CSSProperties } from "react";

// Base styles for cells
const cellBaseStyle: CSSProperties = {
  position: "relative",
  border: "1px solid #d1d5db",
  padding: 0,
};

const inputBaseStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  paddingLeft: "4px",
  paddingRight: "4px",
  paddingTop: "4px",
  paddingBottom: "4px",
  textAlign: "right",
  fontSize: "12px",
  backgroundColor: "transparent",
  outline: "none",
  cursor: "cell",
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
}: GridCellProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(coord, e.target.value);
  };

  const handleMouseDownCell = (e: React.MouseEvent) => {
    // Start selection only when not clicking fill handle
    if (!(e.target as HTMLElement).classList.contains("fill-handle")) {
      onMouseDown(coord);
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

  return (
    <td
      className={cn(
        styles?.cell,
        isSelected && styles?.selected,
        isFillTarget && styles?.fillTarget
      )}
      style={cellStyle}
      onMouseDown={handleMouseDownCell}
      onMouseEnter={() => onMouseEnter(coord)}
    >
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        style={inputBaseStyle}
      />
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

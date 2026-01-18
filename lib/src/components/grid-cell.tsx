import { cn } from "../utils/cn";
import type { GridCellProps } from "../types";

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

  return (
    <td
      className={cn(
        "relative border border-gray-300 p-0",
        styles?.cell,
        isSelected &&
          (styles?.selected ?? "bg-blue-100 ring-2 ring-inset ring-blue-500"),
        isFillTarget && (styles?.fillTarget ?? "bg-blue-50")
      )}
      onMouseDown={handleMouseDownCell}
      onMouseEnter={() => onMouseEnter(coord)}
    >
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className={cn(
          "w-full h-full px-1 py-1 text-right text-xs bg-transparent outline-none cursor-cell",
          isSelected && "bg-transparent"
        )}
      />
      {/* Fill handle */}
      {showFillHandle && (
        <div
          className={cn(
            "fill-handle absolute -bottom-0.5 -right-0.5 w-2 h-2 cursor-crosshair z-20",
            styles?.fillHandle ?? "bg-blue-500"
          )}
          onMouseDown={handleFillHandleDown}
        />
      )}
    </td>
  );
}

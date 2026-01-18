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
        isSelected && "bg-blue-100 ring-2 ring-inset ring-blue-500",
        isFillTarget && "bg-blue-50"
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
          className="fill-handle absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-blue-500 cursor-crosshair z-20"
          onMouseDown={handleFillHandleDown}
        />
      )}
    </td>
  );
}

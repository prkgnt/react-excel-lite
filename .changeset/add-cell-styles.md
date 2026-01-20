---
"react-excel-lite": minor
---

Add `cellStyles` prop for styling individual cells based on coordinates

- New `cellStyles` prop: `(coord: CellCoord) => string | undefined`
- Enables position-based styling (e.g., highlight specific rows/columns)
- Enables value-based conditional formatting (e.g., negative values in red)
- Works with Tailwind CSS, CSS Modules, or plain CSS classes

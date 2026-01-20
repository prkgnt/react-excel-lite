---
"react-excel-lite": patch
---

Fix input expansion direction based on cell position

- Cells in the right half of the grid now expand input to the left
- Cells in the left half expand input to the right (existing behavior)
- Prevents input from being clipped by other components at grid edges

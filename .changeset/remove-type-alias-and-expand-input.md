---
"react-excel-lite": minor
---

### Breaking Changes

- Remove backward compatibility type aliases: `ColHeader`, `ColHeaderGroup`, `RowHeader`, `RowHeaderGroup`
  - Use `Header` and `HeaderGroup` instead

### Features

- Add expandable overlay input in edit mode
  - Input now expands horizontally based on text length when editing
  - Table layout remains stable (no layout shift)

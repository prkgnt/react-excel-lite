# react-excel-lite

## 0.3.0

### Minor Changes

- e597222: feat: HeaderGroup.label을 optional로 변경하여 단일 헤더 지원

  - `HeaderGroup.label`을 optional로 변경
  - 모든 HeaderGroup에 label이 없을 때 그룹 헤더 row/column 없이 개별 헤더만 한 단계로 표시
  - 하나라도 label이 있으면 기존처럼 2단계 레이아웃 유지 (label 없는 그룹은 빈 셀)

## 0.2.0

### Minor Changes

- 4166840: ### Breaking Changes

  - Remove backward compatibility type aliases: `ColHeader`, `ColHeaderGroup`, `RowHeader`, `RowHeaderGroup`
    - Use `Header` and `HeaderGroup` instead

  ### Features

  - Add expandable overlay input in edit mode
    - Input now expands horizontally based on text length when editing
    - Table layout remains stable (no layout shift)

## 0.1.0

### Minor Changes

- a8611ed: ### New Features

  - **Keyboard Navigation**: Arrow keys to move selection, Shift+Arrow to extend selection range
  - **Click Outside to Clear**: Clicking outside the grid now clears the selection
  - **Edit Mode Improvements**:
    - Single click selects cell (no longer enters edit mode)
    - Double-click or Enter to enter edit mode (selects all text)
    - Type any character to enter edit mode and start typing
    - Escape to exit edit mode

  ### Breaking Changes

  - **RowHeaderGroup Structure Changed**: Now mirrors ColHeaderGroup structure
    - Before: `{ key, label, description?, className? }`
    - After: `{ label, headers: RowHeader[], description?, className? }`
  - **New RowHeader Type**: Individual row headers now use `RowHeader` interface
    - `{ key, label, description?, className? }`

  ### Improvements

  - Added `description` field to `ColHeaderGroup` for tooltip support
  - Added `description` field to `RowHeaderGroup` for tooltip support
  - Row headers now support rowSpan grouping (same as column headers)

## 0.0.7

### Patch Changes

- e66d444: customize col and row styles

## 0.0.6

### Patch Changes

- 90410b0: Customize Styles

## 0.0.5

### Patch Changes

- 74b9925: inject css

## 0.0.4

### Patch Changes

- 06890ff: Update version

## 0.0.3

### Patch Changes

- 9e7709a: Update config

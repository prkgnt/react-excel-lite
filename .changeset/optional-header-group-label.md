---
"react-excel-lite": minor
---

feat: HeaderGroup.label을 optional로 변경하여 단일 헤더 지원

- `HeaderGroup.label`을 optional로 변경
- 모든 HeaderGroup에 label이 없을 때 그룹 헤더 row/column 없이 개별 헤더만 한 단계로 표시
- 하나라도 label이 있으면 기존처럼 2단계 레이아웃 유지 (label 없는 그룹은 빈 셀)

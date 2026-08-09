---
name: update-tech
description: Research current frontend hiring trends and update src/constants/techCategories.ts, including categories and aliases. Use when the user asks to refresh, modernize, or review the project's frontend technology list against current hiring demand.
---

# Update Frontend Technology Categories

1. Determine the current year and month and inspect `src/constants/techCategories.ts`.
2. Research primary or reliable current evidence from the last 6–12 months for frontend hiring demand. Evaluate emerging standards, declining technologies, and missing categories. Limit the review to a category supplied by the user, if any.
3. Present proposed additions, removals, and new categories with evidence, then obtain approval before modifying the list.
4. Update `TECH_CATEGORIES` and matching lowercase, dotted, or abbreviated entries in `TECH_ALIASES`. Keep each category at ten technologies or fewer, preserve the color scheme, and exclude niche tools without meaningful hiring demand.
5. Run `pnpm build` and fix any failures.
6. Commit only the technology-category change with `chore: YYYY-MM 채용 트렌드 기반 기술스택 카테고리 업데이트` unless the user requests otherwise.

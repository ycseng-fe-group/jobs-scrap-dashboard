---
name: feature
description: Carry out the repository's full feature workflow from analysis through implementation, review, build, commit, optional technology-category refresh, and production deployment. Use when the user invokes the feature workflow or asks for end-to-end feature delivery.
---

# Feature Workflow

1. Analyze the requested feature, list likely files, and summarize the approach. Ask for approval only when the implementation requires a material user choice.
2. Implement with the existing React, TypeScript, Tailwind, and repository conventions. Avoid abstractions beyond the current requirement.
3. Review changed code for duplication, rendering issues, weak types, deep prop drilling, repeated Tailwind combinations, unused code, and unclear conditions. Fix in-scope findings.
4. Run `pnpm build`; fix failures and rerun until successful.
5. Commit relevant files using the `$commit` workflow.
6. Before deployment, check the current date and `src/constants/techCategories.ts`. If current hiring evidence suggests changes, present the proposed additions/removals and obtain approval before editing. If unchanged, report that it is current. Commit an approved refresh separately with `chore: YYYY-MM 채용 트렌드 기반 기술스택 카테고리 업데이트`.
7. Obtain explicit approval before running `vercel --prod`. Report the production URL after deployment.

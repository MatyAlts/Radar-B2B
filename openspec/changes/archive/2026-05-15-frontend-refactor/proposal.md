# Proposal: Frontend Refactor & Best Practices

## Problem
The current frontend implementation, while functional, lacks a robust design system, standardized CRUD patterns, and a comprehensive help system. Direct state management in pages and the absence of E2E tests lead to maintenance challenges and potential regressions.

## Proposed Solution
Refactor the frontend to follow industry best practices and internal team skills:
1.  **Tailwind v4 Design System**: Implement a semantic token-based theme using OKLCH colors.
2.  **Dashboard CRUD Patterns**: Standardize pages using a "Required Hook Trio" (`useFormModal`, `useConfirmDialog`, `usePagination`) and `PageContainer`.
3.  **Help System**: Integrate a mandatory help system for all pages and forms.
4.  **Playwright E2E**: Establish an E2E testing suite following the Page Object Model (POM).

## Key Deliverables
- Expanded `globals.css` with a full design system.
- Standardized UI components (Button, Input, Card, Badge).
- Core CRUD hooks and Layout components.
- Refactored Radar Page.
- Initial Playwright test suite for critical flows.

## Benefits
- **Maintainability**: Clearer separation of concerns and reusable patterns.
- **Visual Consistency**: Unified design language across all screens.
- **Reliability**: E2E tests ensure core features stay functional during future changes.
- **User Experience**: Improved guidance through the integrated help system.

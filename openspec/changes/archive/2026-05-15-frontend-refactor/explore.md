# Exploration: Frontend Refactor & Best Practices

## Goal
Implement modern frontend patterns, design tokens, and testing best practices using established skills.

## Findings

### Current State
- **Tech Stack**: Next.js 16 (App Router), React 19, Tailwind v4, Zustand, TanStack Query.
- **Patterns**:
  - Direct `useState` for UI state (Drawers, Modals) in pages.
  - Tailwind v3 color classes used despite being on v4.
  - Lack of standardized hooks for CRUD operations.
  - Missing Help System.
  - No E2E tests (Playwright missing).
- **Structure**:
  - `frontend/app/page.tsx` contains header, sidebar, and table logic.
  - Components are located in `frontend/components`.

### Gaps to Bridge
1. **Design System**: Expand `globals.css` with OKLCH tokens and standardize component variants using CVA.
2. **Help System**: Create `HelpButton` and `helpContent.tsx`.
3. **CRUD Patterns**: Implement `useFormModal`, `useConfirmDialog`, and `usePagination` hooks. Refactor pages to use `PageContainer`.
4. **Testing**: Setup Playwright and write initial E2E tests for the Radar page.

## Proposed Changes

### 1. Foundation & Design System
- Update `frontend/app/globals.css` with a full OKLCH theme.
- Standardize `Button`, `Input`, and `Card` using CVA and the new theme.
- Create `frontend/components/layout/PageContainer.tsx`.

### 2. Help System
- Create `frontend/components/ui/HelpButton.tsx`.
- Create `frontend/lib/utils/helpContent.tsx`.

### 3. CRUD Hooks
- Create `frontend/lib/hooks/useFormModal.ts`.
- Create `frontend/lib/hooks/useConfirmDialog.ts`.
- Create `frontend/lib/hooks/usePagination.ts`.

### 4. Radar Page Refactor
- Use `PageContainer` with `helpContent`.
- Replace local state with the new hooks.
- Standardize the layout following the `dashboard-crud-page` Mandatory Page Structure.

### 5. Testing
- Install Playwright.
- Create `frontend/tests/e2e/radar.spec.ts`.
- Implement POM for the Radar page.

## Risks & Considerations
- **React 19 Compatibility**: Ensure hooks (like `useActionState`) are used correctly as per the skill instructions.
- **Tailwind v4 Migration**: Some existing v3 classes might need manual updates to match the new design tokens.

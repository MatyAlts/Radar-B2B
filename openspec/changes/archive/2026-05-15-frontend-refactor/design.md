# Design: Frontend Refactor & Best Practices

## Architecture

### 1. Design System (Tailwind v4)
We will use `@theme` in `globals.css` to define semantic variables.
- Colors will use `oklch()` for better perception.
- Variants for components will be handled by `class-variance-authority` (CVA).

### 2. CRUD Hooks Architecture
Located in `frontend/lib/hooks/`:
- `useFormModal<T, E>`: Manages modal visibility and form data state.
- `useConfirmDialog<E>`: Manages deletion confirmation state.
- `usePagination(items)`: Handles client-side or server-side pagination logic consistently.

### 3. Layout & Help System
- `PageContainer`: A wrapper for all pages providing consistent spacing, header, and the `HelpButton`.
- `HelpButton`: A component that displays a popover with instructions.
- `helpContent.tsx`: A central registry for all page-level help JSX.

### 4. E2E Testing (Playwright)
- Tests will live in `frontend/tests/e2e/`.
- **Page Object Model (POM)**:
  - `RadarPage.ts`: Encapsulates interactions with the Radar table and filters.
  - `CompanyDrawer.ts`: Encapsulates interactions with the detail drawer.

## Implementation Details

### Theme Structure (`globals.css`)
```css
@theme {
  --color-background: oklch(14.5% 0.025 264);
  --color-foreground: oklch(98% 0.01 264);
  --color-primary: oklch(98% 0.01 264);
  /* ... rest of tokens ... */
}
```

### Page Pattern
```tsx
export default function MyPage() {
  const modal = useFormModal(initialData);
  const deleteDialog = useConfirmDialog();
  const { paginatedItems, ...paginationProps } = usePagination(data);

  return (
    <PageContainer helpContent={helpContent.myPage}>
      <Card>
        <Table items={paginatedItems} />
        <Pagination {...paginationProps} />
      </Card>
      <FormModal modal={modal} />
      <ConfirmDialog dialog={deleteDialog} />
    </PageContainer>
  );
}
```

## Verifiability
- **Design Check**: UI matches the new OKLCH color palette.
- **Functional Check**: Help buttons are present and display correct content.
- **Testing Check**: `npx playwright test` passes for the new suite.

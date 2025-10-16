# Features Guide

This document provides detailed information about the key features implemented in the CoffeeHub Admin Portal.

## Table of Contents

1. [Dark Theme Support](#dark-theme-support)
2. [Tailwind CSS Integration](#tailwind-css-integration)
3. [Modern Control Flow Syntax](#modern-control-flow-syntax)
4. [Signal-Based Components](#signal-based-components)
5. [Theme Toggle](#theme-toggle)

---

## Dark Theme Support

### Overview
The application includes a complete dark mode implementation using CSS variables and Tailwind CSS.

### Features
- **Automatic Theme Switching**: Toggle between light and dark modes
- **Persistent State**: Theme preference saved in localStorage
- **Smooth Transitions**: CSS transitions for seamless theme changes
- **System-Wide Theming**: All components respond to theme changes

### CSS Variables

#### Light Theme (Default)
```css
:root {
  --color-primary: #3b82f6;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-primary: #e5e7eb;
}
```

#### Dark Theme
```css
[data-theme='dark'] {
  --color-primary: #3b82f6;
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --border-primary: #374151;
}
```

### Usage in Components

**Using CSS Variables:**
```html
<div [style.background-color]="'var(--bg-primary)'">
  <h1 [style.color]="'var(--text-primary)'">Title</h1>
</div>
```

**Using Tailwind with Dark Mode:**
```html
<div class="bg-primary text-primary">
  Content that adapts to theme
</div>
```

### Theme Service

**Location**: `src/app/core/services/theme.service.ts`

**Methods**:
- `isDarkMode()`: Signal returning current theme state
- `toggleTheme()`: Switches between light and dark modes
- `setTheme(isDark: boolean)`: Sets specific theme

**Example Usage**:
```typescript
import { inject } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';

export class MyComponent {
  private themeService = inject(ThemeService);

  protected isDark = this.themeService.isDarkMode;

  protected toggle() {
    this.themeService.toggleTheme();
  }
}
```

---

## Tailwind CSS Integration

### Configuration

The application uses **Tailwind CSS v4** with the new CSS-first configuration approach.

**File**: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  // Content sources for scanning classes
  content: ['./src/**/*.{html,ts}'],
  theme: {},
  plugins: [],
};
```

**File**: `postcss.config.js`

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**File**: `src/styles.css`

```css
/* Tailwind CSS v4 */
@import "tailwindcss";
```

### Tailwind CSS v4 Upgrades

The project has been upgraded to Tailwind CSS v4.1.14 with the following changes:

**Updated Utilities**:
- `shadow-xs` → `shadow-sm`
- `rounded` → `rounded-sm` (explicit sizing)
- `focus:outline-none` → `focus:outline-hidden`
- `border-0` → `border-none`
- `border-3` → `border-[3px]` (arbitrary values)
- Removed redundant `no-underline` classes

**Benefits of v4**:
- **CSS-first configuration**: Simpler, more intuitive setup
- **Automatic defaults**: All utilities generated without explicit configuration
- **Better performance**: Optimized CSS generation
- **Modern CSS**: Uses CSS variables and modern properties
- **Smaller bundle**: More efficient CSS output

### Custom CSS Variables

The project uses custom CSS variables in `src/styles.scss` for theme-specific colors:

#### Light Theme (Default)
```css
:root {
  --color-primary: #3b82f6;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-primary: #e5e7eb;
}
```

#### Dark Theme
```css
[data-theme='dark'] {
  --color-primary: #3b82f6;
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --border-primary: #374151;
}
```

### Integration with Tailwind v4

Tailwind CSS v4 automatically generates all standard utilities (spacing, colors, typography, etc.) without explicit configuration. Custom CSS variables work seamlessly alongside Tailwind's default utilities.

---

## Modern Control Flow Syntax

### Overview
All templates use Angular 17+'s new control flow syntax with `@if`, `@for`, and `@switch`.

### Benefits
- Better type checking
- Improved performance
- Cleaner syntax
- Built-in track expressions

### Examples

#### Conditional Rendering

**Old Syntax**:
```html
<div *ngIf="isLoading">Loading...</div>
<div *ngIf="!isLoading">Content</div>
```

**New Syntax**:
```html
@if (isLoading()) {
  <div>Loading...</div>
} @else {
  <div>Content</div>
}
```

#### Lists

**Old Syntax**:
```html
<div *ngFor="let item of items; let i = index; trackBy: trackByFn">
  {{ item.name }}
</div>
```

**New Syntax**:
```html
@for (item of items(); track item.id; let i = $index) {
  <div>{{ item.name }}</div>
}
```

#### Switch Cases

**Old Syntax**:
```html
<div [ngSwitch]="status">
  <div *ngSwitchCase="'pending'">Pending</div>
  <div *ngSwitchCase="'active'">Active</div>
  <div *ngSwitchDefault>Unknown</div>
</div>
```

**New Syntax**:
```html
@switch (status()) {
  @case ('pending') { <div>Pending</div> }
  @case ('active') { <div>Active</div> }
  @default { <div>Unknown</div> }
}
```

#### Empty States

```html
@if (items().length > 0) {
  @for (item of items(); track item.id) {
    <div>{{ item.name }}</div>
  }
} @else {
  <div>No items found</div>
}
```

---

## Signal-Based Components

### Overview
All components use Angular's signal-based APIs for inputs and outputs.

### Input Signals

**Syntax**:
```typescript
import { Component, input } from '@angular/core';

@Component({...})
export class MyComponent {
  // Required input
  readonly name = input.required<string>();

  // Optional input with default
  readonly count = input(0);

  // Optional input
  readonly title = input<string>();
}
```

**Usage in Template**:
```html
<div>{{ name() }}</div>
<div>Count: {{ count() }}</div>
```

### Output Signals

**Syntax**:
```typescript
import { Component, output } from '@angular/core';

@Component({...})
export class MyComponent {
  readonly clicked = output<void>();
  readonly valueChanged = output<string>();

  protected handleClick() {
    this.clicked.emit();
  }
}
```

**Parent Usage**:
```html
<app-my-component
  (clicked)="onClicked()"
  (valueChanged)="onValueChanged($event)"
/>
```

### Computed Signals

**Syntax**:
```typescript
import { Component, input, computed } from '@angular/core';

@Component({...})
export class MyComponent {
  readonly firstName = input('');
  readonly lastName = input('');

  protected readonly fullName = computed(() =>
    `${this.firstName()} ${this.lastName()}`
  );
}
```

### Model Signals (Two-Way Binding)

**Syntax**:
```typescript
import { Component, model } from '@angular/core';

@Component({...})
export class MyComponent {
  readonly value = model<string>('');
}
```

**Parent Usage**:
```html
<app-my-component [(value)]="myValue" />
```

---

## Theme Toggle

### Component

**Location**: `src/app/shared/components/theme-toggle/theme-toggle.ts`

### Features
- Click to toggle theme
- Keyboard accessible (Enter/Space)
- Visual indicator (🌙/☀️)
- Smooth transitions

### Implementation

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      (click)="toggleTheme()"
      (keyup.enter)="toggleTheme()"
      (keyup.space)="toggleTheme()"
      class="px-4 py-2 rounded-md transition-colors"
      [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      {{ isDark() ? '☀️' : '🌙' }}
    </button>
  `,
})
export class ThemeToggle {
  private themeService = inject(ThemeService);
  protected readonly isDark = this.themeService.isDarkMode;

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
```

### Usage

Simply include in your component:
```html
<app-theme-toggle />
```

---

## Best Practices

### Theming
1. Always use CSS variables for colors
2. Use Tailwind's custom utilities (`bg-primary`, `text-primary`)
3. Test components in both light and dark modes
4. Ensure sufficient contrast in both themes

### Control Flow
1. Always include `track` expressions in `@for` loops
2. Use `$index` when items don't have unique IDs
3. Prefer `@if/@else` over conditional classes when possible
4. Use `@switch` for multiple conditions on the same value

### Signals
1. Use `input()` for all component inputs
2. Use `output()` for all component outputs
3. Use `computed()` for derived state
4. Use `model()` for two-way binding
5. Call signals as functions in templates: `{{ value() }}`

### Performance
1. All components use `OnPush` change detection
2. Signals automatically optimize change detection
3. Use `track` expressions to minimize re-renders
4. Keep computed signals pure (no side effects)

---

## Migration Guide

### From Old to New Control Flow

1. **Search and Replace**:
   - `*ngIf="condition"` → `@if (condition) {` (add closing `}`)
   - `*ngFor="let item of items"` → `@for (item of items; track item.id) {`

2. **Update Track Expressions**:
   - Add `track item.id` or `track $index`
   - Choose unique identifier when possible

3. **Test Thoroughly**:
   - Verify all conditions work correctly
   - Check loop rendering
   - Ensure no performance regressions

### Adding Dark Theme Support

1. **Update Component Styles**:
   ```html
   <!-- Before -->
   <div class="bg-white text-gray-900">

   <!-- After -->
   <div class="bg-primary text-primary">
   ```

2. **Use CSS Variables**:
   ```html
   <!-- Inline styles -->
   <div [style.background-color]="'var(--bg-primary)'">
   ```

3. **Test Both Themes**:
   - Toggle theme and verify appearance
   - Check color contrast
   - Ensure readability

---

## Troubleshooting

### Dark Theme Not Working
- Check `[data-theme]` attribute on `<body>`
- Verify CSS variables are defined
- Clear browser cache
- Check browser DevTools for CSS overrides

### Tailwind Classes Not Applied
- Verify `tailwind.config.js` content paths
- Check if file is included in glob pattern
- Ensure `postcss.config.js` has `@tailwindcss/postcss` plugin
- Verify `styles.css` has `@import "tailwindcss";`
- Rebuild the project: `npm run build`
- Clear browser cache with hard refresh (Ctrl+Shift+R)
- Clear `.angular` cache and restart dev server

### Control Flow Errors
- Ensure closing braces `}` are present
- Check track expressions are valid
- Verify signal calls use `()` syntax
- Review template syntax highlighting

---

For more information, see:
- [README.md](../README.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [CHANGELOG.md](../CHANGELOG.md)

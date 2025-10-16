# Architecture Diagrams

This document contains visual representations of the CoffeeHub Admin Portal architecture.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           User Browser                               │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ HTTPS
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         Nginx (Port 80)                              │
│  • Serves static files                                               │
│  • SPA routing (fallback to index.html)                             │
│  • Gzip compression                                                  │
│  • Security headers                                                  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       Angular Application                            │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                      App Component                              │ │
│  │                   <router-outlet>                               │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                     Routing Layer                               │ │
│  │  • Guards (auth, role)                                          │ │
│  │  • Lazy loading                                                 │ │
│  │  • Navigation                                                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                     Core Module                                 │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │ │
│  │  │  Services    │  │   Guards     │  │   Interceptors       │ │ │
│  │  │ • AuthService│  │ • authGuard  │  │ • authInterceptor    │ │ │
│  │  │ • ApiService │  │ • roleGuard  │  │ • errorInterceptor   │ │ │
│  │  │ • ThemeService│ │              │  │                      │ │ │
│  │  │ • CartService│  │              │  │                      │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Shared Module                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │  Components: Button, Card, Modal, Table, Spinner         │  │ │
│  │  │  Pipes: CurrencyFormat, TimeAgo                           │  │ │
│  │  │  Directives: Highlight                                    │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                   Feature Modules (Lazy Loaded)                 │ │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐              │ │
│  │  │  Auth  │  │ Stores │  │  Menu  │  │ Orders │              │ │
│  │  │ Login  │  │ List   │  │ List   │  │ List   │              │ │
│  │  │        │  │ Form   │  │ Form   │  │        │              │ │
│  │  └────────┘  └────────┘  └────────┘  └────────┘              │ │
│  └────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         Mock Backend                                 │
│  • In-memory data stores                                             │
│  • Observable-based async responses                                  │
│  • 300ms simulated latency                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Module Dependencies

```
┌────────────────────────────────────────────────────────────┐
│                     App Module                              │
│                   (Bootstrap)                               │
└──────────┬─────────────────────────────────────────────────┘
           │
           │ depends on
           ↓
┌────────────────────────────────────────────────────────────┐
│                     Core Module                             │
│  • Singleton services                                       │
│  • Global guards & interceptors                             │
│  • No UI components                                         │
└──────────┬─────────────────────────────────────────────────┘
           │
           │ provides to
           ↓
┌────────────────────────────────────────────────────────────┐
│                   Feature Modules                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Each feature imports:                                │  │
│  │  • Core services (AuthService, etc.)                 │  │
│  │  • Shared components (Button, Card, etc.)            │  │
│  │  • Standalone components                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Features:                                                   │
│  • Auth        (Login)                                      │
│  • Dashboard   (Metrics, Navigation)                        │
│  • Stores      (CRUD operations)                            │
│  • Menu        (CRUD operations)                            │
│  • Orders      (View, Update status)                        │
└─────────────────────────────────────────────────────────────┘
           ↑
           │ imports
           │
┌──────────┴─────────────────────────────────────────────────┐
│                   Shared Module                             │
│  • Reusable UI components                                   │
│  • Pipes & Directives                                       │
│  • No business logic                                        │
│  • Used by all features                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App Component
│
├─ Router Outlet
   │
   ├─ Login Component (Lazy)
   │
   ├─ Dashboard Component (Lazy)
   │  └─ Quick Action Cards
   │
   ├─ Stores Feature (Lazy)
   │  ├─ StoresListComponent (Smart)
   │  │  └─ CardComponent (Dumb) [multiple]
   │  │     ├─ ButtonComponent (Dumb)
   │  │     └─ Store Details (inline)
   │  │
   │  └─ StoreFormComponent (Smart)
   │     ├─ CardComponent (Dumb)
   │     ├─ ButtonComponent (Dumb) [multiple]
   │     └─ Input fields
   │
   ├─ Menu Feature (Lazy)
   │  ├─ MenuListComponent (Smart)
   │  │  └─ CardComponent (Dumb) [multiple]
   │  │     └─ ButtonComponent (Dumb)
   │  │
   │  └─ MenuFormComponent (Smart)
   │     └─ CardComponent (Dumb)
   │        ├─ Form Arrays (Sizes, Ingredients)
   │        └─ ButtonComponent (Dumb) [multiple]
   │
   └─ Orders Feature (Lazy)
      └─ OrdersListComponent (Smart)
         ├─ Filters (inline)
         ├─ CardComponent (Dumb) [multiple]
         │  └─ ButtonComponent (Dumb)
         └─ Pagination (inline)
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Action                              │
│  (Click button, submit form, navigate)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                 Smart Component                              │
│  • Receives user event                                       │
│  • Validates input (if needed)                               │
│  • Calls service method                                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                              │
│  • Business logic                                            │
│  • Data transformation                                       │
│  • Returns Observable                                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                HTTP Interceptors (if needed)                 │
│  • authInterceptor: Add token                                │
│  • errorInterceptor: Handle errors                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Mock Backend                               │
│  • Process request                                           │
│  • Return mock data                                          │
│  • Simulate delay (300ms)                                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│               Service (Observable Response)                  │
│  • Receives data                                             │
│  • Returns to component                                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│          Component (Subscribe & Update Signal)               │
│  • signal.set(data) or signal.update(...)                    │
│  • Triggers change detection                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    UI Re-render                              │
│  • OnPush checks for changes                                 │
│  • Updates only changed components                           │
│  • Renders new data                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User on Login Page                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Enters credentials
                           ↓
┌─────────────────────────────────────────────────────────────┐
│               LoginComponent.onSubmit()                      │
│  • Validates form                                            │
│  • Calls authService.login(username, password)               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  AuthService.login()                         │
│  • Checks credentials against mock users                     │
│  • If valid:                                                 │
│    - Creates User object                                     │
│    - Stores in localStorage                                  │
│    - Updates currentUser signal                              │
│    - Returns Observable<User>                                │
│  • If invalid:                                               │
│    - Returns throwError                                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│            LoginComponent.subscribe()                        │
│  • On success:                                               │
│    - Navigates to /dashboard                                 │
│  • On error:                                                 │
│    - Shows error message                                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Router Navigation                           │
│  • Navigates to /dashboard                                   │
│  • authGuard checks isAuthenticated()                        │
│  • Allows access if authenticated                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│               Dashboard Component Loaded                     │
│  • Reads currentUser() signal                                │
│  • Displays welcome message                                  │
│  • Shows role-based actions                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## HTTP Request Flow

```
Component
    │
    │ calls service method
    ↓
Service.getStores()
    │
    │ returns Observable
    ↓
HTTP Request
    │
    │ passes through
    ↓
authInterceptor
    │
    │ adds Authorization header
    │ Bearer mock-token-123
    ↓
errorInterceptor
    │
    │ wraps request
    │ handles errors
    ↓
HttpClient
    │
    │ (would make real HTTP call)
    ↓
Mock Backend
    │
    │ returns of(mockData)
    │ pipe(delay(300))
    ↓
Observable<Store[]>
    │
    │ returns through interceptors
    ↓
Service
    │
    │ returns Observable to component
    ↓
Component.subscribe()
    │
    │ next: (stores) => signal.set(stores)
    │ error: (err) => handleError(err)
    ↓
Signal Update
    │
    │ triggers change detection
    ↓
UI Update
```

---

## Signal State Flow

```
Service (State Container)
┌────────────────────────────────────┐
│ private storesSignal = signal([])  │
│ readonly stores = asReadonly()     │
└────────────────┬───────────────────┘
                 │
                 │ exposes read-only
                 ↓
Component A                     Component B
┌──────────────────────┐       ┌──────────────────────┐
│ stores = service.    │       │ stores = service.    │
│          stores      │       │          stores      │
│                      │       │                      │
│ openStores = comput- │       │ count = computed(    │
│   ed(() => stores()  │       │   () => stores().len │
│   .filter(open))     │       │ )                    │
└──────────────────────┘       └──────────────────────┘
         │                              │
         │ both react to changes        │
         ↓                              ↓
    Template                       Template
    ┌──────────┐                  ┌──────────┐
    │ Displays │                  │ Displays │
    │ filtered │                  │ count    │
    │ list     │                  │          │
    └──────────┘                  └──────────┘

When signal updates:
─────────────────────────────
1. service.storesSignal.set(newStores)
2. Both Component A and B signals auto-update
3. Computed signals recalculate
4. Change detection triggers (OnPush)
5. Templates re-render with new data
```

---

## Lazy Loading Flow

```
Initial Load
┌──────────────────────────────────────────────────────────┐
│ User navigates to https://coffeehub.com                  │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│ Browser requests index.html                               │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│ Loads Initial Bundle (~79 KB gzipped)                    │
│  • main.js       (2.13 KB)                               │
│  • polyfills.js  (34.59 KB)                              │
│  • chunk.js      (144.04 KB)                             │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│ App Component Bootstraps                                 │
│ Router checks current URL                                │
│ authGuard redirects to /login (not authenticated)        │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────┐
│ Lazy Load: Login Component Chunk (4.42 KB)              │
│ Router: loadComponent(() => import('./login...'))        │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ User logs in and navigates to /dashboard
                         ↓
┌──────────────────────────────────────────────────────────┐
│ Lazy Load: Dashboard Component Chunk (4.30 KB)          │
│ Router: loadComponent(() => import('./dashboard...'))    │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ User clicks "Manage Stores"
                         ↓
┌──────────────────────────────────────────────────────────┐
│ Lazy Load: Stores Chunks (5.42 KB + 8.00 KB)            │
│  • stores-list.component                                 │
│  • stores dependencies                                   │
└────────────────────────┬─────────────────────────────────┘
                         │
                         │ User clicks "Add Store"
                         ↓
┌──────────────────────────────────────────────────────────┐
│ Store Form Already Loaded (shared chunk)                 │
│ Router navigates instantly                               │
└──────────────────────────────────────────────────────────┘

Summary:
────────
• Initial: ~79 KB (required to start app)
• Login: +4.42 KB (loaded on demand)
• Dashboard: +4.30 KB (loaded when accessed)
• Each feature: +5-13 KB (loaded when accessed)

Total if visiting all pages: ~110 KB
vs.
Non-lazy loading: ~280 KB upfront
```

---

## Smart vs Dumb Component Pattern

```
┌────────────────────────────────────────────────────────────┐
│              Smart Component (Container)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Responsibilities:                                     │  │
│  │ • Manages state (signals)                            │  │
│  │ • Calls services                                     │  │
│  │ • Handles business logic                             │  │
│  │ • Subscribes to observables                          │  │
│  │ • Passes data to dumb components                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Example: StoresListComponent                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ stores = signal<Store[]>([]);                        │  │
│  │ loading = signal(false);                             │  │
│  │                                                       │  │
│  │ ngOnInit() {                                         │  │
│  │   this.loadStores();                                 │  │
│  │ }                                                     │  │
│  │                                                       │  │
│  │ loadStores() {                                       │  │
│  │   this.service.getStores().subscribe(...)           │  │
│  │ }                                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Passes data down ↓                                         │
└────────────────────┬───────────────────────────────────────┘
                     │
                     │ @Input() store
                     │ @Output() edit
                     │ @Output() delete
                     ↓
┌────────────────────────────────────────────────────────────┐
│             Dumb Component (Presentational)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Responsibilities:                                     │  │
│  │ • Receives data via @Input                           │  │
│  │ • Emits events via @Output                           │  │
│  │ • Pure presentation logic                            │  │
│  │ • No service dependencies                            │  │
│  │ • Reusable across features                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Example: CardComponent                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ @Input() title: string;                              │  │
│  │ @Input() elevated: boolean;                          │  │
│  │ @Output() action = new EventEmitter();               │  │
│  │                                                       │  │
│  │ <div class="card">                                   │  │
│  │   <h3>{{ title }}</h3>                               │  │
│  │   <ng-content></ng-content>                          │  │
│  │ </div>                                                │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## Change Detection Strategy

```
┌────────────────────────────────────────────────────────────┐
│                   Default Change Detection                  │
│  (Checks EVERY component on EVERY event)                   │
└────────────────────────────────────────────────────────────┘
                 ↓ SLOW - checks everything ↓
┌────────────────────────────────────────────────────────────┐
│                 App Component (checked)                     │
│  ├─ Header (checked)                                        │
│  ├─ Sidebar (checked)                                       │
│  └─ Router Outlet                                           │
│     ├─ Feature A (checked)                                  │
│     │  ├─ Component 1 (checked)                            │
│     │  ├─ Component 2 (checked)                            │
│     │  └─ Component 3 (checked)                            │
│     └─ Feature B (checked)                                  │
│        ├─ Component 4 (checked)                            │
│        └─ Component 5 (checked)                            │
└────────────────────────────────────────────────────────────┘

                            VS

┌────────────────────────────────────────────────────────────┐
│                  OnPush Change Detection                    │
│  (Only checks when inputs change or events occur)          │
└────────────────────────────────────────────────────────────┘
                 ↓ FAST - checks only what changed ↓
┌────────────────────────────────────────────────────────────┐
│                 App Component (checked)                     │
│  ├─ Header (skipped - no changes)                          │
│  ├─ Sidebar (skipped - no changes)                         │
│  └─ Router Outlet                                           │
│     ├─ Feature A (checked - signal updated)                │
│     │  ├─ Component 1 (checked - input changed)            │
│     │  ├─ Component 2 (skipped - no changes)               │
│     │  └─ Component 3 (skipped - no changes)               │
│     └─ Feature B (skipped - no changes)                    │
│        ├─ Component 4 (skipped)                            │
│        └─ Component 5 (skipped)                            │
└────────────────────────────────────────────────────────────┘

Result: ~90% reduction in change detection cycles
```

---

## Theme Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interaction                          │
│         (Click theme toggle button)                          │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  ThemeToggle Component                       │
│  protected toggle() {                                        │
│    this.themeService.toggleTheme();                          │
│  }                                                            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                     ThemeService                             │
│  toggleTheme() {                                             │
│    const newTheme = !this.isDarkMode();                      │
│    this.setTheme(newTheme);                                  │
│  }                                                            │
│                                                               │
│  setTheme(isDark: boolean) {                                 │
│    this.darkModeSignal.set(isDark);                          │
│    localStorage.setItem('theme', isDark ? 'dark' : 'light'); │
│    this.updateDOM(isDark);                                   │
│  }                                                            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                      DOM Updates                             │
│  document.body.setAttribute('data-theme',                    │
│    isDark ? 'dark' : 'light');                               │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                   CSS Variables Applied                      │
│                                                               │
│  [data-theme='dark'] {                                       │
│    --bg-primary: #1f2937;                                    │
│    --text-primary: #f9fafb;                                  │
│    --border-primary: #374151;                                │
│  }                                                            │
│                                                               │
│  Tailwind utilities automatically use variables:             │
│  .bg-primary { background: var(--bg-primary); }              │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  UI Re-renders                               │
│  • All components using CSS variables update                 │
│  • OnPush change detection triggered by signal              │
│  • Smooth transitions applied via CSS                        │
└─────────────────────────────────────────────────────────────┘

State Persistence:
┌─────────────────────────────────────────────────────────────┐
│  On App Init:                                                │
│  1. ThemeService reads localStorage                          │
│  2. Applies saved theme or defaults to light                 │
│  3. Sets data-theme attribute                                │
│  4. Updates signal state                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tailwind CSS v4 Build Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   Development / Build                        │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                 Angular Build Process                        │
│  ng build / ng serve                                         │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                PostCSS Processing                            │
│  (postcss.config.js)                                         │
│  plugins: {                                                  │
│    '@tailwindcss/postcss': {}                                │
│  }                                                            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              Tailwind CSS v4 Engine                          │
│  1. Reads src/styles.css:                                    │
│     @import "tailwindcss";                                   │
│                                                               │
│  2. Loads tailwind.config.js:                                │
│     content: ['./src/**/*.{html,ts}']                        │
│                                                               │
│  3. Scans all HTML/TS files for utility classes              │
│                                                               │
│  4. Generates CSS for used utilities only:                   │
│     - .py-4 { padding-block: calc(var(--spacing) * 4) }     │
│     - .bg-blue-500 { background-color: rgb(59 130 246) }    │
│     - .text-white { color: rgb(255 255 255) }                │
│                                                               │
│  5. Auto-generates spacing/color/typography variables        │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                 CSS Output (styles.css)                      │
│  • All Tailwind utilities (only used ones)                   │
│  • Custom CSS from styles.scss (theme variables)             │
│  • Optimized and minified for production                     │
│  • Gzipped: ~5KB (from 27KB raw)                             │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                 Browser / Application                        │
│  • Fast load times with minimal CSS                          │
│  • All utilities available for dynamic classes               │
│  • Theme switching via CSS variables                         │
└─────────────────────────────────────────────────────────────┘

Key Benefits:
┌─────────────────────────────────────────────────────────────┐
│  ✅ No explicit theme configuration needed                   │
│  ✅ All utilities auto-generated from defaults               │
│  ✅ Smaller CSS output (only used utilities)                 │
│  ✅ Faster build times                                       │
│  ✅ CSS-first approach is simpler to maintain                │
└─────────────────────────────────────────────────────────────┘
```

---

````
```

---

These diagrams provide a visual understanding of the application's architecture, data flow, and key patterns used throughout the codebase.

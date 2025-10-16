# Architecture Documentation

## Overview

CoffeeHub Admin Portal follows a modular, scalable architecture based on Angular best practices. The application is designed with separation of concerns, maintainability, and performance optimization in mind.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Client                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│                  Angular Application                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │              App Shell (Router Outlet)           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │                 Core Module                       │  │
│  │  • Services (Auth, API)                          │  │
│  │  • Guards (Auth, Role)                           │  │
│  │  • Interceptors (Auth, Error)                    │  │
│  │  • Models                                        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │               Shared Module                       │  │
│  │  • Components (Button, Card, Modal, etc.)        │  │
│  │  • Pipes (CurrencyFormat, TimeAgo)               │  │
│  │  • Directives (Highlight)                        │  │
│  │  • Utilities                                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Feature Modules                      │  │
│  │  ┌────────┐  ┌────────┐  ┌──────┐  ┌─────────┐  │  │
│  │  │  Auth  │  │ Stores │  │ Menu │  │ Orders  │  │  │
│  │  └────────┘  └────────┘  └──────┘  └─────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│               Mock Backend Services                      │
│  • In-memory data stores                                │
│  • Observable-based async operations                    │
└─────────────────────────────────────────────────────────┘
```

## Module Structure

### 1. Core Module (`src/app/core/`)

**Purpose**: Singleton services, global state, and application-wide functionality.

**Components**:
- **Services**:
  - `auth.service.ts`: Handles authentication, user state
  - `api.service.ts`: Generic HTTP client wrapper
  - `theme.service.ts`: Dark mode and theme management
  - `cart.service.ts`: Shopping cart state management
- **Guards** (Angular 20+ naming):
  - `auth.ts`: Protects authenticated routes
  - `role.ts`: Role-based access control
- **Interceptors** (Angular 20+ naming):
  - `auth.ts`: Adds authentication tokens
  - `error.ts`: Global error handling
- **Models**: Core data structures shared across features

**Key Principles**:
- Singleton pattern (providedIn: 'root')
- No UI components
- Pure business logic
- Stateless where possible

### 2. Shared Module (`src/app/shared/`)

**Purpose**: Reusable UI components, pipes, and directives.

**Components** (Angular 20+ naming):
- `button.ts`: Configurable button with variants
- `card.ts`: Container with header, body, footer
- `modal.ts`: Overlay dialog component
- `table.ts`: Data table with sorting
- `spinner.ts`: Loading indicator

**Pipes** (Angular 20+ naming):
- `currency-format.ts`: Format numbers as currency
- `time-ago.ts`: Display relative timestamps

**Directives** (Angular 20+ naming):
- `highlight.ts`: Hover highlight effect

**Key Principles**:
- Presentational (dumb) components
- No business logic
- Highly reusable
- OnPush change detection
- Input/Output based communication

### 3. Feature Modules (`src/app/features/`)

**Purpose**: Business features organized by domain.

#### Auth Feature
- `login.ts` - Authentication form and flow
- User session management

#### Dashboard Feature
- `dashboard.ts` - Overview metrics and quick actions
- Navigation hub

#### Stores Feature (Angular 20+ naming)
- `stores-list.ts` - Store list (smart component)
- `store-form.ts` - Store form (smart component)
- CRUD operations via `store.service.ts`

#### Menu Feature (Angular 20+ naming)
- `menu-list.ts` - Menu list with filtering (smart component)
- `menu-form.ts` - Menu form with dynamic arrays (smart component)
- Category-based organization via `menu.service.ts`

#### Orders Feature (Angular 20+ naming)
- `orders-list.ts` - Order list with pagination (smart component)
- `order-detail.ts` - Order detail view
- Status management via `order.service.ts`
- Filter and search capabilities

**Key Principles**:
- Feature isolation
- Lazy loading support
- Smart/dumb component pattern
- Feature-specific services
- Domain-driven design

## Component Architecture

### Smart vs Dumb Components

```
Smart Component (Container)
├── Manages state
├── Calls services
├── Handles business logic
├── Routes data to dumb components
└── Example: StoresList (stores-list.ts)

Dumb Component (Presentational)
├── Receives data via input()
├── Emits events via output()
├── No service dependencies
├── Pure presentation logic
└── Example: Button (button.ts), Card (card.ts)
```

### Component Lifecycle (Angular 20+ Pattern)

```typescript
// Modern Angular 20+ component (example.ts)
@Component({
  selector: 'app-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ...],
  template: `...`,
  styles: [`...`]
})
export class Example implements OnInit {
  // Injected services using inject() function
  private readonly service = inject(SomeService);

  // Signals for reactive state
  protected readonly data = signal<Type[]>([]);
  protected readonly loading = signal(false);

  // Computed signals
  protected readonly filteredData = computed(() => {
    return this.data().filter(...);
  });

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.service.getData().subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      }
    });
  }
}
```

**Key Angular 20+ Patterns**:
- Use `inject()` function instead of constructor injection
- Use `protected readonly` for properties accessed in templates
- Remove `.component` suffix from file names and class names
- Simplified naming: `Example` instead of `ExampleComponent`

## State Management

### Signal-Based State

The application uses Angular signals for state management:

```typescript
// Service with signal state
@Injectable({ providedIn: 'root' })
export class StoreService {
  private storesSignal = signal<Store[]>([]);
  readonly stores = this.storesSignal.asReadonly();

  updateStores(stores: Store[]) {
    this.storesSignal.set(stores);
  }
}

// Component consuming signal (Angular 20+ pattern)
export class StoresList {
  private readonly storeService = inject(StoreService);
  protected readonly stores = this.storeService.stores;

  // Computed from signal
  protected readonly openStores = computed(() => {
    return this.stores().filter(s => s.status === 'OPEN');
  });
}
```

**Benefits**:
- Automatic dependency tracking
- Better performance than Zone.js
- Type-safe
- Works seamlessly with OnPush
- Simpler than RxJS for simple state

## Routing Architecture

### Lazy Loading Strategy

```typescript
// Modern Angular 20+ routing with simplified naming
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login')
      .then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard')
      .then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'stores',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/stores/stores-list/stores-list')
          .then(m => m.StoresList)
      },
      {
        path: 'create',
        loadComponent: () => import('./features/stores/store-form/store-form')
          .then(m => m.StoreForm)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./features/stores/store-form/store-form')
          .then(m => m.StoreForm)
      }
    ]
  }
];
```

**Benefits**:
- Reduced initial bundle size
- Faster initial load time
- On-demand feature loading
- Better code splitting

### Route Guards (Angular 20+ Pattern)

```typescript
// Functional guard using inject() - auth.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

// Guard factory for role-based access - role.ts
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const user = authService.currentUser();

    if (user && allowedRoles.includes(user.role)) {
      return true;
    }

    return false;
  };
};
```

**Note**: Guards follow Angular 20+ conventions with simplified file names (`auth.ts`, `role.ts`) without `.guard` suffix.

## Data Flow

### Unidirectional Data Flow

```
Service (Source of Truth)
    ↓
Smart Component (State Management)
    ↓
Dumb Component (Presentation)
    ↓
User Action (Event)
    ↓
Smart Component (Handler)
    ↓
Service (Update State)
    ↓
Signal Update
    ↓
UI Re-render (OnPush)
```

### HTTP Flow with Interceptors

```
Component → Service → HTTP Request
    ↓
Auth Interceptor (Add Token)
    ↓
HTTP Client
    ↓
Backend (Mock in our case)
    ↓
HTTP Response
    ↓
Error Interceptor (Handle Errors)
    ↓
Service → Observable
    ↓
Component (Update Signal)
```

## Performance Optimizations

### 1. OnPush Change Detection

All components use `ChangeDetectionStrategy.OnPush`:
- Only checks when inputs change
- Or when events are emitted
- Or when observables/signals update
- Reduces unnecessary checks by ~90%

### 2. Lazy Loading

Features are loaded on-demand:
- Initial bundle: ~79KB (gzipped)
- Each feature: 1-9KB (gzipped)
- Faster initial page load
- Better perceived performance

### 3. Signal-Based Reactivity

Signals replace Zone.js change detection:
- Fine-grained updates
- Only affected components re-render
- Better performance than RxJS for simple state
- Automatic dependency tracking

### 4. Immutable Data Patterns

```typescript
// Bad: Mutating array
this.items.push(newItem);

// Good: Immutable update
this.items.set([...this.items(), newItem]);
```

### 5. TrackBy Functions

```typescript
<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>

trackById(index: number, item: Item): string {
  return item.id;
}
```

## Security Architecture

### Authentication Flow

```
1. User enters credentials
2. LoginComponent calls AuthService.login()
3. AuthService validates (mock) and stores token
4. User object stored in localStorage
5. Signal updated with current user
6. Router navigates to dashboard
7. Auth guard allows access
```

### Token Management (Angular 20+ Pattern)

```typescript
// Auth interceptor adds token to requests - auth.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.currentUser();

  if (user) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer mock-token-${user.id}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
```

**Note**: Interceptors use functional approach with `inject()` and simplified file names without `.interceptor` suffix.

### Role-Based Access Control

```typescript
// Routes protected by role
{
  path: 'admin',
  canActivate: [authGuard, roleGuard([UserRole.ADMIN])],
  loadComponent: () => import('./admin/...')
}
```

## Testing Strategy

### Unit Testing Structure

```
src/app/
├── core/
│   └── services/
│       ├── auth.service.ts
│       └── auth.service.spec.ts
├── shared/
│   └── components/
│       ├── button/
│       │   ├── button.component.ts
│       │   └── button.component.spec.ts
```

### Testing Approach (Angular 20+ Files)

1. **Services**: Test business logic in `*.service.spec.ts` files
2. **Components**: Test public API in `*.spec.ts` files (e.g., `button.spec.ts`)
3. **Guards**: Test authorization logic in guard spec files
4. **Pipes**: Test transformations in pipe spec files
5. **Integration**: Test feature flows

**Example Test Structure**:
```typescript
// button.spec.ts
describe('Button', () => {
  it('should emit clicked event', () => {
    // Test implementation
  });
});
```

## Deployment Architecture

### Docker Multi-Stage Build

```
Stage 1: Build
- Node 18 Alpine
- Install dependencies
- Build Angular app
- Output to dist/

Stage 2: Serve
- Nginx Alpine
- Copy built app
- Configure routing
- Serve on port 80
```

### Nginx Configuration

```nginx
# SPA routing
location / {
  try_files $uri $uri/ /index.html;
}

# Cache static assets
location ~* \.(js|css|png|jpg|svg)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# Security headers
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
```

## Scalability Considerations

### Current Scale
- Small to medium applications
- 1-100 concurrent users
- Mock backend (no external dependencies)

### Future Scale
- Add real backend API
- Implement caching strategies
- Add CDN for static assets
- Implement service workers (PWA)
- Add state persistence
- Implement WebSocket for real-time updates

## Code Organization Principles

1. **Single Responsibility**: Each module/component has one job
2. **DRY**: Shared logic in services/utilities
3. **SOLID**: Follow SOLID principles
4. **Separation of Concerns**: UI, business logic, data access
5. **Composition over Inheritance**: Use composition for reusability

## Conclusion

This architecture provides:
- ✅ Scalability: Easy to add new features
- ✅ Maintainability: Clear separation of concerns
- ✅ Performance: Optimized bundle sizes and change detection
- ✅ Testability: Isolated, mockable components
- ✅ Developer Experience: Clear patterns and conventions

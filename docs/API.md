# API Documentation

## Overview

This document describes the service APIs used in the CoffeeHub Admin Portal. Currently, all services use mock data. The interface contracts are defined to make it easy to replace with real backend APIs.

---

## Authentication API

### AuthService

**Location**: `src/app/core/services/auth.service.ts`

#### Methods

##### `login(username: string, password: string): Observable<User>`

Authenticates a user with username and password.

**Parameters**:
- `username` (string): User's username
- `password` (string): User's password

**Returns**: `Observable<User>` - User object with role and profile info

**Example**:
```typescript
this.authService.login('admin', 'admin123').subscribe({
  next: (user) => console.log('Logged in:', user),
  error: (err) => console.error('Login failed:', err)
});
```

**Demo Credentials**:
| Username | Password    | Role    |
|----------|-------------|---------|
| admin    | admin123    | ADMIN   |
| manager  | manager123  | MANAGER |
| staff    | staff123    | STAFF   |

##### `logout(): void`

Logs out the current user and redirects to login page.

**Example**:
```typescript
this.authService.logout();
```

##### `isAuthenticated(): boolean`

Checks if user is currently authenticated.

**Returns**: `boolean` - true if authenticated

**Example**:
```typescript
if (this.authService.isAuthenticated()) {
  // User is logged in
}
```

##### `currentUser: Signal<User | null>`

Readonly signal containing the current user.

**Example**:
```typescript
export class HeaderComponent {
  currentUser = inject(AuthService).currentUser;
}

// In template
<span>Welcome, {{ currentUser()?.firstName }}</span>
```

---

## Theme Management API

### ThemeService

**Location**: `src/app/core/services/theme.service.ts`

#### Methods

##### `isDarkMode(): Signal<boolean>`

Returns a readonly signal indicating whether dark mode is currently enabled.

**Returns**: `Signal<boolean>` - true if dark mode is active

**Example**:
```typescript
export class Header {
  private themeService = inject(ThemeService);
  protected isDark = this.themeService.isDarkMode;
}

// In template
<span>{{ isDark() ? 'Dark' : 'Light' }} Mode</span>
```

##### `toggleTheme(): void`

Toggles between light and dark themes.

**Example**:
```typescript
export class ThemeToggle {
  private themeService = inject(ThemeService);

  protected toggle() {
    this.themeService.toggleTheme();
  }
}
```

##### `setTheme(isDark: boolean): void`

Sets the theme to a specific mode.

**Parameters**:
- `isDark` (boolean): true for dark mode, false for light mode

**Example**:
```typescript
// Set to dark mode
this.themeService.setTheme(true);

// Set to light mode
this.themeService.setTheme(false);
```

**Implementation Details**:
- Theme preference is saved to localStorage
- Updates `data-theme` attribute on document body
- Automatically loads saved preference on initialization

---

## Cart Management API

### CartService

**Location**: `src/app/core/services/cart.service.ts`

#### Methods

##### `items: Signal<CartItem[]>`

Readonly signal containing all cart items.

**Returns**: `Signal<CartItem[]>`

**Example**:
```typescript
export class Cart {
  private cartService = inject(CartService);
  protected items = this.cartService.items;
  
  protected total = computed(() => {
    return this.items().reduce((sum, item) => sum + item.price * item.quantity, 0);
  });
}
```

##### `itemCount: Signal<number>`

Readonly computed signal returning the total number of items in the cart.

**Returns**: `Signal<number>`

**Example**:
```typescript
// In template
<span class="badge">{{ itemCount() }}</span>
```

##### `addItem(item: CartItem): void`

Adds an item to the cart or increases quantity if already exists.

**Parameters**:
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}
```

**Example**:
```typescript
const item: CartItem = {
  id: '1',
  name: 'Latte',
  price: 4.50,
  quantity: 1,
  size: 'Medium'
};

this.cartService.addItem(item);
```

##### `removeItem(itemId: string): void`

Removes an item from the cart.

**Parameters**:
- `itemId` (string): ID of the item to remove

**Example**:
```typescript
this.cartService.removeItem('1');
```

##### `updateQuantity(itemId: string, quantity: number): void`

Updates the quantity of an item in the cart.

**Parameters**:
- `itemId` (string): ID of the item
- `quantity` (number): New quantity

**Example**:
```typescript
this.cartService.updateQuantity('1', 3);
```

##### `clearCart(): void`

Removes all items from the cart.

**Example**:
```typescript
this.cartService.clearCart();
```

---

## Store Management API

### StoreService

**Location**: `src/app/features/stores/services/store.service.ts`

#### Methods

##### `getStores(): Observable<Store[]>`

Retrieves all stores.

**Returns**: `Observable<Store[]>`

**Example**:
```typescript
this.storeService.getStores().subscribe({
  next: (stores) => this.stores.set(stores)
});
```

##### `getStoreById(id: string): Observable<Store>`

Retrieves a single store by ID.

**Parameters**:
- `id` (string): Store ID

**Returns**: `Observable<Store>`

**Errors**: Throws error if store not found

**Example**:
```typescript
this.storeService.getStoreById('1').subscribe({
  next: (store) => console.log(store),
  error: (err) => console.error('Store not found')
});
```

##### `createStore(dto: CreateStoreDto): Observable<Store>`

Creates a new store.

**Parameters**:
```typescript
interface CreateStoreDto {
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  manager: string;
  openingHours: string;
  capacity: number;
}
```

**Returns**: `Observable<Store>`

**Example**:
```typescript
const newStore: CreateStoreDto = {
  name: 'Downtown Store',
  location: 'Main Street',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  phone: '(555) 123-4567',
  email: 'downtown@coffeehub.com',
  manager: 'John Doe',
  openingHours: '6:00 AM - 10:00 PM',
  capacity: 50
};

this.storeService.createStore(newStore).subscribe({
  next: (store) => console.log('Created:', store)
});
```

##### `updateStore(id: string, dto: UpdateStoreDto): Observable<Store>`

Updates an existing store.

**Parameters**:
- `id` (string): Store ID
- `dto` (UpdateStoreDto): Partial store data

```typescript
interface UpdateStoreDto extends Partial<CreateStoreDto> {
  status?: StoreStatus;
}
```

**Returns**: `Observable<Store>`

**Example**:
```typescript
this.storeService.updateStore('1', {
  name: 'New Name',
  capacity: 60
}).subscribe({
  next: (store) => console.log('Updated:', store)
});
```

##### `deleteStore(id: string): Observable<void>`

Deletes a store.

**Parameters**:
- `id` (string): Store ID

**Returns**: `Observable<void>`

**Example**:
```typescript
this.storeService.deleteStore('1').subscribe({
  next: () => console.log('Store deleted')
});
```

#### Models

```typescript
interface Store {
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  manager: string;
  openingHours: string;
  status: StoreStatus;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

enum StoreStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  MAINTENANCE = 'MAINTENANCE'
}
```

---

## Menu Management API

### MenuService

**Location**: `src/app/features/menu/services/menu.service.ts`

#### Methods

##### `getMenuItems(): Observable<MenuItem[]>`

Retrieves all menu items.

**Returns**: `Observable<MenuItem[]>`

##### `getMenuItemById(id: string): Observable<MenuItem>`

Retrieves a single menu item by ID.

**Parameters**:
- `id` (string): Menu item ID

**Returns**: `Observable<MenuItem>`

##### `getMenuItemsByCategory(category: MenuCategory): Observable<MenuItem[]>`

Retrieves menu items filtered by category.

**Parameters**:
- `category` (MenuCategory): Menu category enum

**Returns**: `Observable<MenuItem[]>`

**Example**:
```typescript
this.menuService.getMenuItemsByCategory(MenuCategory.COFFEE)
  .subscribe({
    next: (items) => console.log('Coffee items:', items)
  });
```

##### `createMenuItem(dto: CreateMenuItemDto): Observable<MenuItem>`

Creates a new menu item.

**Parameters**:
```typescript
interface CreateMenuItemDto {
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  sizes: DrinkSize[];
  ingredients: string[];
  calories: number;
  prepTime: number; // in minutes
}
```

**Returns**: `Observable<MenuItem>`

**Example**:
```typescript
const newItem: CreateMenuItemDto = {
  name: 'Caramel Latte',
  description: 'Smooth latte with caramel',
  category: MenuCategory.COFFEE,
  price: 4.50,
  sizes: [
    { name: 'Small', price: 3.50, ounces: 8 },
    { name: 'Medium', price: 4.50, ounces: 12 },
    { name: 'Large', price: 5.50, ounces: 16 }
  ],
  ingredients: ['Espresso', 'Milk', 'Caramel'],
  calories: 240,
  prepTime: 3
};

this.menuService.createMenuItem(newItem).subscribe({
  next: (item) => console.log('Created:', item)
});
```

##### `updateMenuItem(id: string, dto: UpdateMenuItemDto): Observable<MenuItem>`

Updates an existing menu item.

**Parameters**:
- `id` (string): Menu item ID
- `dto` (UpdateMenuItemDto): Partial menu item data

##### `deleteMenuItem(id: string): Observable<void>`

Deletes a menu item.

##### `toggleAvailability(id: string): Observable<MenuItem>`

Toggles the availability status of a menu item.

**Parameters**:
- `id` (string): Menu item ID

**Returns**: `Observable<MenuItem>` - Updated menu item

#### Models

```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  sizes: DrinkSize[];
  available: boolean;
  imageUrl?: string;
  ingredients: string[];
  calories: number;
  prepTime: number;
  createdAt: Date;
  updatedAt: Date;
}

enum MenuCategory {
  COFFEE = 'COFFEE',
  ESPRESSO = 'ESPRESSO',
  TEA = 'TEA',
  BLENDED = 'BLENDED',
  PASTRIES = 'PASTRIES',
  SNACKS = 'SNACKS'
}

interface DrinkSize {
  name: 'Small' | 'Medium' | 'Large';
  price: number;
  ounces: number;
}
```

---

## Order Management API

### OrderService

**Location**: `src/app/features/orders/services/order.service.ts`

#### Methods

##### `getOrders(params: PaginationParams, filters?: OrderFilters): Observable<PaginatedResponse<Order>>`

Retrieves paginated list of orders with optional filtering.

**Parameters**:
```typescript
interface PaginationParams {
  page: number;      // 1-based page number
  pageSize: number;  // Items per page
}

interface OrderFilters {
  status?: OrderStatus;
  storeId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;   // Search by order number or customer
}
```

**Returns**:
```typescript
interface PaginatedResponse<Order> {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
}
```

**Example**:
```typescript
const params: PaginationParams = {
  page: 1,
  pageSize: 25
};

const filters: OrderFilters = {
  status: OrderStatus.PENDING,
  search: 'john'
};

this.orderService.getOrders(params, filters).subscribe({
  next: (response) => {
    console.log('Orders:', response.items);
    console.log('Total:', response.total);
    console.log('Pages:', Math.ceil(response.total / params.pageSize));
  }
});
```

##### `getOrderById(id: string): Observable<Order | undefined>`

Retrieves a single order by ID.

**Parameters**:
- `id` (string): Order ID

**Returns**: `Observable<Order | undefined>`

##### `updateOrderStatus(id: string, status: OrderStatus): Observable<Order | undefined>`

Updates the status of an order.

**Parameters**:
- `id` (string): Order ID
- `status` (OrderStatus): New status

**Returns**: `Observable<Order | undefined>` - Updated order

**Example**:
```typescript
this.orderService.updateOrderStatus('1', OrderStatus.COMPLETED)
  .subscribe({
    next: (order) => console.log('Order completed:', order)
  });
```

#### Models

```typescript
interface Order {
  id: string;
  orderNumber: string;         // e.g., "ORD-000001"
  customerName: string;
  customerEmail: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  orderDate: Date;
  completedDate?: Date;
}

interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  customizations?: string[];
}

enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  MOBILE_PAY = 'MOBILE_PAY'
}
```

---

## Common Patterns

### Observable Pattern

All services return Observables for async operations:

```typescript
// Subscribe in component
this.service.getData().subscribe({
  next: (data) => {
    // Handle success
    this.data.set(data);
  },
  error: (err) => {
    // Handle error
    console.error(err);
  },
  complete: () => {
    // Optional: Handle completion
  }
});

// Or use async pipe in template
data$ = this.service.getData();

// Template:
<div *ngIf="data$ | async as data">
  {{ data }}
</div>
```

### Error Handling

All services include error handling:

```typescript
// Service method
getStoreById(id: string): Observable<Store> {
  const store = this.mockStores.find(s => s.id === id);
  if (!store) {
    return throwError(() => new Error('Store not found'));
  }
  return of(store).pipe(delay(200));
}

// Component usage
this.storeService.getStoreById(id).subscribe({
  error: (err) => {
    this.errorMessage.set(err.message);
  }
});
```

### Mock Delays

All mock services include realistic delays:

```typescript
return of(data).pipe(delay(300)); // Simulate network latency
```

---

## Migration to Real Backend

To replace mock services with real API:

### 1. Keep Service Interfaces

```typescript
// Interface remains the same
interface StoreService {
  getStores(): Observable<Store[]>;
  getStoreById(id: string): Observable<Store>;
  createStore(dto: CreateStoreDto): Observable<Store>;
  // ...
}
```

### 2. Replace Implementation

```typescript
// From:
getStores(): Observable<Store[]> {
  return of(this.mockStores).pipe(delay(300));
}

// To:
getStores(): Observable<Store[]> {
  return this.http.get<Store[]>(`${this.apiUrl}/stores`);
}
```

### 3. Add API Service

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`);
  }
}
```

### 4. Update Environment

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.coffeehub.com'
};
```

### 5. Components Remain Unchanged

No changes needed in components since they use the same service interface.

---

## Testing APIs

### Example Service Test

```typescript
describe('StoreService', () => {
  let service: StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreService);
  });

  it('should retrieve all stores', (done) => {
    service.getStores().subscribe({
      next: (stores) => {
        expect(stores.length).toBeGreaterThan(0);
        done();
      }
    });
  });

  it('should create a new store', (done) => {
    const newStore: CreateStoreDto = {
      name: 'Test Store',
      // ...
    };

    service.createStore(newStore).subscribe({
      next: (store) => {
        expect(store.id).toBeDefined();
        expect(store.name).toBe('Test Store');
        done();
      }
    });
  });
});
```

---

## Rate Limiting (Future)

When connecting to real API, implement rate limiting:

```typescript
import { throttleTime } from 'rxjs/operators';

// Throttle requests
this.service.getData()
  .pipe(throttleTime(1000))
  .subscribe(...);
```

---

## Caching (Future)

Implement caching for frequently accessed data:

```typescript
@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache = new Map<string, any>();

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any, ttl: number = 300000): void {
    this.cache.set(key, value);
    setTimeout(() => this.cache.delete(key), ttl);
  }
}
```

---

## Conclusion

The API structure is designed to:
- ✅ Be easy to understand and use
- ✅ Follow Observable patterns
- ✅ Include proper error handling
- ✅ Be easily replaceable with real backend
- ✅ Support testing and mocking

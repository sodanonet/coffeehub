import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { MenuItem, CreateMenuItemDto, UpdateMenuItemDto, MenuCategory } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menuItemsSignal = signal<MenuItem[]>([]);
  readonly menuItems = this.menuItemsSignal.asReadonly();

  private mockMenuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Caramel Macchiato',
      description: 'Espresso with steamed milk and caramel',
      category: MenuCategory.ESPRESSO,
      price: 5.5,
      sizes: [
        { name: 'Small', price: 4.5, ounces: 8 },
        { name: 'Medium', price: 5.5, ounces: 12 },
        { name: 'Large', price: 6.5, ounces: 16 },
      ],
      available: true,
      ingredients: ['Espresso', 'Milk', 'Caramel', 'Vanilla'],
      calories: 250,
      prepTime: 3,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
    },
    {
      id: '2',
      name: 'Vanilla Latte',
      description: 'Classic latte with vanilla syrup',
      category: MenuCategory.COFFEE,
      price: 4.75,
      sizes: [
        { name: 'Small', price: 3.75, ounces: 8 },
        { name: 'Medium', price: 4.75, ounces: 12 },
        { name: 'Large', price: 5.75, ounces: 16 },
      ],
      available: true,
      ingredients: ['Coffee', 'Milk', 'Vanilla Syrup'],
      calories: 190,
      prepTime: 2,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
    },
    {
      id: '3',
      name: 'Green Tea Latte',
      description: 'Matcha green tea with steamed milk',
      category: MenuCategory.TEA,
      price: 5.0,
      sizes: [
        { name: 'Small', price: 4.0, ounces: 8 },
        { name: 'Medium', price: 5.0, ounces: 12 },
        { name: 'Large', price: 6.0, ounces: 16 },
      ],
      available: true,
      ingredients: ['Matcha', 'Milk', 'Sugar'],
      calories: 210,
      prepTime: 3,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12'),
    },
    {
      id: '4',
      name: 'Mocha Frappuccino',
      description: 'Blended coffee with chocolate and ice',
      category: MenuCategory.BLENDED,
      price: 6.0,
      sizes: [
        { name: 'Small', price: 5.0, ounces: 12 },
        { name: 'Medium', price: 6.0, ounces: 16 },
        { name: 'Large', price: 7.0, ounces: 20 },
      ],
      available: true,
      ingredients: ['Coffee', 'Milk', 'Chocolate', 'Ice', 'Whipped Cream'],
      calories: 320,
      prepTime: 4,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '5',
      name: 'Croissant',
      description: 'Buttery, flaky French pastry',
      category: MenuCategory.PASTRIES,
      price: 3.5,
      sizes: [{ name: 'Medium', price: 3.5, ounces: 4 }],
      available: true,
      ingredients: ['Flour', 'Butter', 'Yeast', 'Sugar'],
      calories: 280,
      prepTime: 1,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
  ];

  constructor() {
    this.menuItemsSignal.set([...this.mockMenuItems]);
  }

  getMenuItems(): Observable<MenuItem[]> {
    return of([...this.mockMenuItems]).pipe(delay(300));
  }

  getMenuItemById(id: string): Observable<MenuItem> {
    const item = this.mockMenuItems.find((m) => m.id === id);
    if (!item) {
      return throwError(() => new Error('Menu item not found'));
    }
    return of({ ...item }).pipe(delay(200));
  }

  getMenuItemsByCategory(category: MenuCategory): Observable<MenuItem[]> {
    const filtered = this.mockMenuItems.filter((item) => item.category === category);
    return of(filtered).pipe(delay(250));
  }

  createMenuItem(dto: CreateMenuItemDto): Observable<MenuItem> {
    const newItem: MenuItem = {
      id: (this.mockMenuItems.length + 1).toString(),
      ...dto,
      available: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockMenuItems.push(newItem);
    this.menuItemsSignal.set([...this.mockMenuItems]);

    return of(newItem).pipe(delay(400));
  }

  updateMenuItem(id: string, dto: UpdateMenuItemDto): Observable<MenuItem> {
    const index = this.mockMenuItems.findIndex((m) => m.id === id);
    if (index === -1) {
      return throwError(() => new Error('Menu item not found'));
    }

    const updatedItem: MenuItem = {
      ...this.mockMenuItems[index],
      ...dto,
      updatedAt: new Date(),
    };

    this.mockMenuItems[index] = updatedItem;
    this.menuItemsSignal.set([...this.mockMenuItems]);

    return of(updatedItem).pipe(delay(400));
  }

  deleteMenuItem(id: string): Observable<void> {
    const index = this.mockMenuItems.findIndex((m) => m.id === id);
    if (index === -1) {
      return throwError(() => new Error('Menu item not found'));
    }

    this.mockMenuItems.splice(index, 1);
    this.menuItemsSignal.set([...this.mockMenuItems]);

    return of(void 0).pipe(delay(300));
  }

  toggleAvailability(id: string): Observable<MenuItem> {
    const item = this.mockMenuItems.find((m) => m.id === id);
    if (!item) {
      return throwError(() => new Error('Menu item not found'));
    }

    return this.updateMenuItem(id, { available: !item.available });
  }

  searchMenuItems(query: string): Observable<MenuItem[]> {
    const filtered = this.mockMenuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()),
    );

    return of(filtered).pipe(delay(200));
  }
}

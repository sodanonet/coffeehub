import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  menuItemId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  customizations?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  private selectedStoreId = signal<string | null>(null);

  readonly items = this.cartItems.asReadonly();
  readonly storeId = this.selectedStoreId.asReadonly();

  readonly itemCount = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly total = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  });

  setStore(storeId: string): void {
    this.selectedStoreId.set(storeId);
  }

  addItem(item: Omit<CartItem, 'quantity'>): void {
    const currentItems = this.cartItems();
    const existingIndex = currentItems.findIndex(
      (i) =>
        i.menuItemId === item.menuItemId &&
        i.size === item.size &&
        JSON.stringify(i.customizations) === JSON.stringify(item.customizations),
    );

    if (existingIndex >= 0) {
      const updated = [...currentItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      };
      this.cartItems.set(updated);
    } else {
      this.cartItems.set([...currentItems, { ...item, quantity: 1 }]);
    }
  }

  updateQuantity(index: number, quantity: number): void {
    const currentItems = this.cartItems();
    if (quantity <= 0) {
      this.removeItem(index);
    } else {
      const updated = [...currentItems];
      updated[index] = { ...updated[index], quantity };
      this.cartItems.set(updated);
    }
  }

  removeItem(index: number): void {
    const updated = this.cartItems().filter((_, i) => i !== index);
    this.cartItems.set(updated);
  }

  clear(): void {
    this.cartItems.set([]);
    this.selectedStoreId.set(null);
  }
}

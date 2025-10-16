import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuService } from '../menu/services/menu.service';
import { MenuItem, MenuCategory } from '../menu/models/menu.model';
import { CartService } from '../../core/services/cart.service';
import { CustomerHeader } from '../../shared/components/customer-header/customer-header';
import { Button } from '../../shared/components/button/button';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-order-menu',
  standalone: true,
  imports: [CommonModule, CustomerHeader, Button, LoadingSpinner],
  templateUrl: './order-menu.html',
})
export class OrderMenu implements OnInit {
  private menuService = inject(MenuService);
  private cartService = inject(CartService);
  private router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly menuItems = signal<MenuItem[]>([]);
  protected readonly selectedCategory = signal<MenuCategory | null>(null);
  protected readonly categories = Object.values(MenuCategory);

  protected readonly cartItemCount = this.cartService.itemCount;
  protected readonly cartTotal = this.cartService.total;

  protected readonly filteredItems = signal<MenuItem[]>([]);

  ngOnInit(): void {
    // Check if store is selected
    if (!this.cartService.storeId()) {
      this.router.navigate(['/']);
      return;
    }

    this.loadMenu();
  }

  private loadMenu(): void {
    this.loading.set(true);
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        // Filter only available items
        const availableItems = items.filter((item) => item.available);
        this.menuItems.set(availableItems);
        this.filteredItems.set(availableItems);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading menu:', error);
        this.loading.set(false);
      },
    });
  }

  protected filterByCategory(category: MenuCategory): void {
    this.selectedCategory.set(category);
    const filtered = this.menuItems().filter((item) => item.category === category);
    this.filteredItems.set(filtered);
  }

  protected clearFilter(): void {
    this.selectedCategory.set(null);
    this.filteredItems.set(this.menuItems());
  }

  protected addToCart(item: MenuItem): void {
    // Use first size as default
    const defaultSize = item.sizes[0];
    this.cartService.addItem({
      menuItemId: item.id,
      name: item.name,
      size: defaultSize.name,
      price: defaultSize.price,
    });
  }

  protected goToCheckout(): void {
    if (this.cartItemCount() > 0) {
      this.router.navigate(['/order/checkout']);
    }
  }
}

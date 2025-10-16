import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StoreService } from '../stores/services/store.service';
import { Store } from '../stores/models/store.model';
import { CartService } from '../../core/services/cart.service';
import { CustomerHeader } from '../../shared/components/customer-header/customer-header';
import { Button } from '../../shared/components/button/button';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, CustomerHeader, Button, LoadingSpinner],
  templateUrl: './customer-home.html',
})
export class CustomerHome implements OnInit {
  private storeService = inject(StoreService);
  private cartService = inject(CartService);
  private router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly stores = signal<Store[]>([]);
  protected readonly selectedStoreId = this.cartService.storeId;

  ngOnInit(): void {
    this.loadStores();
  }

  private loadStores(): void {
    this.loading.set(true);
    this.storeService.getStores().subscribe({
      next: (stores) => {
        // Filter to only show open stores
        const openStores = stores.filter((s) => s.status === 'OPEN');
        this.stores.set(openStores);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.loading.set(false);
      },
    });
  }

  protected selectStore(store: Store): void {
    if (store.status !== 'OPEN') {
      alert('This store is currently closed');
      return;
    }

    this.cartService.setStore(store.id);
    this.router.navigate(['/order/menu']);
  }
}

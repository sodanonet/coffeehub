import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../services/store.service';
import { Store } from '../models/store.model';
import { Button } from '../../../shared/components/button/button';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-stores-list',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, LoadingSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stores-list.html',
})
export class StoresList implements OnInit {
  private storeService = inject(StoreService);
  private router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly stores = signal<Store[]>([]);
  protected searchQuery = '';

  ngOnInit(): void {
    this.loadStores();
  }

  private loadStores(): void {
    this.loading.set(true);
    this.storeService.getStores().subscribe({
      next: (stores) => {
        this.stores.set(stores);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.loading.set(false);
      },
    });
  }

  protected onSearch(): void {
    if (this.searchQuery.trim()) {
      this.storeService.searchStores(this.searchQuery).subscribe({
        next: (stores) => this.stores.set(stores),
      });
    } else {
      this.loadStores();
    }
  }

  protected navigateToCreate(): void {
    this.router.navigate(['/admin/stores/create']);
  }

  protected navigateToEdit(id: string): void {
    this.router.navigate(['/admin/stores', id, 'edit']);
  }

  protected confirmDelete(store: Store): void {
    if (confirm(`Are you sure you want to delete ${store.name}?`)) {
      this.deleteStore(store.id);
    }
  }

  private deleteStore(id: string): void {
    this.storeService.deleteStore(id).subscribe({
      next: () => {
        this.loadStores();
      },
      error: (error) => {
        console.error('Error deleting store:', error);
        alert('Failed to delete store');
      },
    });
  }
}

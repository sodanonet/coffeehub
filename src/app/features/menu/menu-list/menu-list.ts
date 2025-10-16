import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../services/menu.service';
import { MenuItem, MenuCategory } from '../models/menu.model';
import { Button } from '../../../shared/components/button/button';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, LoadingSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-list.html',
})
export class MenuList implements OnInit {
  private menuService = inject(MenuService);
  private router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly menuItems = signal<MenuItem[]>([]);
  protected searchQuery = '';
  protected selectedCategory = '';
  protected showOnlyAvailable = false;

  protected readonly categories = Object.values(MenuCategory);

  ngOnInit(): void {
    this.loadMenuItems();
  }

  private loadMenuItems(): void {
    this.loading.set(true);
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems.set(items);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading menu items:', error);
        this.loading.set(false);
      },
    });
  }

  protected onSearch(): void {
    if (this.searchQuery.trim()) {
      this.menuService.searchMenuItems(this.searchQuery).subscribe({
        next: (items) => this.menuItems.set(items),
      });
    } else {
      this.loadMenuItems();
    }
  }

  protected onCategoryFilter(): void {
    if (this.selectedCategory) {
      this.menuService.getMenuItemsByCategory(this.selectedCategory as MenuCategory).subscribe({
        next: (items) => this.menuItems.set(items),
      });
    } else {
      this.loadMenuItems();
    }
  }

  protected onAvailabilityFilter(): void {
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        const filtered = this.showOnlyAvailable ? items.filter((item) => item.available) : items;
        this.menuItems.set(filtered);
      },
    });
  }

  protected toggleAvailability(item: MenuItem): void {
    this.menuService.toggleAvailability(item.id).subscribe({
      next: () => this.loadMenuItems(),
    });
  }

  protected navigateToCreate(): void {
    this.router.navigate(['/admin/menu/create']);
  }

  protected navigateToEdit(id: string): void {
    this.router.navigate(['/admin/menu', id, 'edit']);
  }

  protected confirmDelete(item: MenuItem): void {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      this.deleteMenuItem(item.id);
    }
  }

  private deleteMenuItem(id: string): void {
    this.menuService.deleteMenuItem(id).subscribe({
      next: () => this.loadMenuItems(),
      error: (error) => {
        console.error('Error deleting menu item:', error);
        alert('Failed to delete menu item');
      },
    });
  }
}

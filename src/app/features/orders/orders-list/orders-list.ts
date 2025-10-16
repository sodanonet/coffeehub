import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { Order, OrderStatus, PaginationParams, OrderFilters } from '../models/order.model';
import { Button } from '../../../shared/components/button/button';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, LoadingSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orders-list.html',
})
export class OrdersList implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);

  protected readonly loading = signal(true);
  protected readonly orders = signal<Order[]>([]);
  protected readonly currentPage = signal(1);
  protected readonly totalOrders = signal(0);
  protected readonly pageSize = 12;
  protected searchQuery = '';
  protected statusFilter = '';
  protected readonly statuses = Object.values(OrderStatus);
  protected readonly Math = Math;

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.loading.set(true);
    const params: PaginationParams = {
      page: this.currentPage(),
      pageSize: this.pageSize,
    };
    const filters: OrderFilters = {};
    if (this.statusFilter) filters.status = this.statusFilter as OrderStatus;
    if (this.searchQuery) filters.search = this.searchQuery;

    this.orderService.getOrders(params, filters).subscribe({
      next: (response) => {
        this.orders.set(response.items);
        this.totalOrders.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading.set(false);
      },
    });
  }

  protected totalPages(): number {
    return Math.ceil(this.totalOrders() / this.pageSize);
  }

  protected getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range: number[] = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) range.unshift(-1);
    if (current + delta < total - 1) range.push(-1);
    range.unshift(1);
    if (total > 1) range.push(total);

    return range;
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadOrders();
  }

  protected previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadOrders();
    }
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadOrders();
    }
  }

  protected onSearch(): void {
    this.currentPage.set(1);
    this.loadOrders();
  }

  protected onFilterChange(): void {
    this.currentPage.set(1);
    this.loadOrders();
  }

  protected viewOrderDetail(id: string): void {
    this.router.navigate(['/admin/orders', id]);
  }

  protected formatPaymentMethod(method: string): string {
    return method
      .replace('_', ' ')
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

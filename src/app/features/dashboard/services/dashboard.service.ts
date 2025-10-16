import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  DashboardMetrics,
  TopDrink,
  StoreStatus,
  SalesData,
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private metricsSignal = signal<DashboardMetrics | null>(null);
  readonly metrics = this.metricsSignal.asReadonly();

  private mockMetrics: DashboardMetrics = {
    dailySales: 12450.75,
    totalOrders: 156,
    activeStores: 8,
    averageOrderValue: 79.81,
  };

  private mockTopDrinks: TopDrink[] = [
    {
      id: '1',
      name: 'Caramel Macchiato',
      category: 'Coffee',
      sales: 45,
      revenue: 247.5,
    },
    {
      id: '2',
      name: 'Vanilla Latte',
      category: 'Coffee',
      sales: 38,
      revenue: 209.0,
    },
    {
      id: '3',
      name: 'Iced Americano',
      category: 'Coffee',
      sales: 35,
      revenue: 157.5,
    },
    {
      id: '4',
      name: 'Cappuccino',
      category: 'Coffee',
      sales: 32,
      revenue: 176.0,
    },
    {
      id: '5',
      name: 'Mocha Frappuccino',
      category: 'Blended',
      sales: 28,
      revenue: 168.0,
    },
  ];

  private mockStoreStatuses: StoreStatus[] = [
    {
      id: '1',
      name: 'Downtown Store',
      location: 'Main St',
      status: 'open',
      todaySales: 2450,
    },
    {
      id: '2',
      name: 'Airport Branch',
      location: 'Terminal 1',
      status: 'open',
      todaySales: 3200,
    },
    {
      id: '3',
      name: 'Mall Location',
      location: 'Shopping Center',
      status: 'open',
      todaySales: 1850,
    },
    {
      id: '4',
      name: 'University Store',
      location: 'Campus Ave',
      status: 'closed',
      todaySales: 1950,
    },
  ];

  private mockSalesData: SalesData[] = [
    { date: '2024-02-14', amount: 11200 },
    { date: '2024-02-15', amount: 10800 },
    { date: '2024-02-16', amount: 12100 },
    { date: '2024-02-17', amount: 9800 },
    { date: '2024-02-18', amount: 13000 },
    { date: '2024-02-19', amount: 11500 },
    { date: '2024-02-20', amount: 12450.75 },
  ];

  constructor() {
    this.metricsSignal.set(this.mockMetrics);
  }

  loadDashboardMetrics(): Observable<DashboardMetrics> {
    return of(this.mockMetrics).pipe(delay(300));
  }

  getTopDrinks(): Observable<TopDrink[]> {
    return of([...this.mockTopDrinks]).pipe(delay(250));
  }

  getStoreStatuses(): Observable<StoreStatus[]> {
    return of([...this.mockStoreStatuses]).pipe(delay(200));
  }

  getSalesData(): Observable<SalesData[]> {
    return of([...this.mockSalesData]).pipe(delay(200));
  }
}

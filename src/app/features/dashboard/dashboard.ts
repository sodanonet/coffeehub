import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from './services/dashboard.service';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import {
  DashboardMetrics,
  TopDrink,
  StoreStatus,
} from './models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);

  protected readonly loading = signal(true);
  protected readonly metrics = signal<DashboardMetrics | null>(null);
  protected readonly topDrinks = signal<TopDrink[]>([]);
  protected readonly storeStatuses = signal<StoreStatus[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);

    Promise.all([
      this.dashboardService.loadDashboardMetrics().toPromise(),
      this.dashboardService.getTopDrinks().toPromise(),
      this.dashboardService.getStoreStatuses().toPromise(),
    ]).then(([metrics, drinks, stores]) => {
      this.metrics.set(metrics!);
      this.topDrinks.set(drinks!);
      this.storeStatuses.set(stores!);
      this.loading.set(false);
    });
  }
}

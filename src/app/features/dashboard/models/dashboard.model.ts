export interface DashboardMetrics {
  dailySales: number;
  totalOrders: number;
  activeStores: number;
  averageOrderValue: number;
}

export interface TopDrink {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
}

export interface StoreStatus {
  id: string;
  name: string;
  location: string;
  status: 'open' | 'closed';
  todaySales: number;
}

export interface SalesData {
  date: string;
  amount: number;
}

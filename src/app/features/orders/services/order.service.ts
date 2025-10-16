import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Order,
  OrderStatus,
  PaymentMethod,
  PaginationParams,
  OrderFilters,
} from '../models/order.model';
import { PaginatedResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly STORAGE_KEY = 'coffeehub_orders';
  private ordersSignal = signal<Order[]>([]);
  readonly orders = this.ordersSignal.asReadonly();

  private mockOrders: Order[] = this.loadOrdersFromStorage() || this.generateMockOrders(50);

  private generateMockOrders(count: number): Order[] {
    const orders: Order[] = [];
    const stores = ['Downtown Store', 'Airport Branch', 'University Campus'];
    const customers = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];
    const drinks = [
      { name: 'Caramel Macchiato', price: 5.5 },
      { name: 'Vanilla Latte', price: 4.75 },
      { name: 'Green Tea Latte', price: 5.0 },
      { name: 'Mocha Frappuccino', price: 6.0 },
    ];
    const statuses = Object.values(OrderStatus);
    const payments = Object.values(PaymentMethod);

    for (let i = 1; i <= count; i++) {
      const numItems = Math.floor(Math.random() * 3) + 1;
      const items = [];
      let total = 0;

      for (let j = 0; j < numItems; j++) {
        const drink = drinks[Math.floor(Math.random() * drinks.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;
        const itemTotal = drink.price * quantity;
        total += itemTotal;

        items.push({
          id: `${i}-${j}`,
          menuItemId: `menu-${j}`,
          name: drink.name,
          size: ['Small', 'Medium', 'Large'][Math.floor(Math.random() * 3)],
          quantity,
          price: drink.price,
          customizations: Math.random() > 0.5 ? ['Extra shot', 'Almond milk'] : undefined,
        });
      }

      const daysAgo = Math.floor(Math.random() * 30);
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - daysAgo);
      orderDate.setHours(Math.floor(Math.random() * 12) + 6);

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const completedDate =
        status === OrderStatus.COMPLETED
          ? new Date(orderDate.getTime() + Math.random() * 3600000)
          : undefined;

      orders.push({
        id: i.toString(),
        orderNumber: `ORD-${String(i).padStart(6, '0')}`,
        customerName: customers[Math.floor(Math.random() * customers.length)],
        customerEmail: `customer${i}@email.com`,
        storeId: (Math.floor(Math.random() * 3) + 1).toString(),
        storeName: stores[Math.floor(Math.random() * stores.length)],
        items,
        total,
        status,
        paymentMethod: payments[Math.floor(Math.random() * payments.length)],
        orderDate,
        completedDate,
      });
    }

    return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
  }

  constructor() {
    this.ordersSignal.set([...this.mockOrders]);
    this.saveOrdersToStorage();
  }

  private loadOrdersFromStorage(): Order[] | null {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const orders = JSON.parse(stored);
        // Convert date strings back to Date objects
        return orders.map((order: Order) => ({
          ...order,
          orderDate: new Date(order.orderDate),
          completedDate: order.completedDate ? new Date(order.completedDate) : undefined,
        }));
      }
    } catch (error) {
      console.error('Error loading orders from storage:', error);
    }
    return null;
  }

  private saveOrdersToStorage(): void {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.mockOrders));
    } catch (error) {
      console.error('Error saving orders to storage:', error);
    }
  }

  getOrders(
    params: PaginationParams,
    filters?: OrderFilters,
  ): Observable<PaginatedResponse<Order>> {
    let filtered = [...this.mockOrders];

    // Apply filters
    if (filters?.status) {
      filtered = filtered.filter((order) => order.status === filters.status);
    }
    if (filters?.storeId) {
      filtered = filtered.filter((order) => order.storeId === filters.storeId);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(search) ||
          order.customerName.toLowerCase().includes(search) ||
          order.customerEmail.toLowerCase().includes(search),
      );
    }

    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize;
    const paginatedItems = filtered.slice(start, end);

    const response: PaginatedResponse<Order> = {
      items: paginatedItems,
      total: filtered.length,
      page: params.page,
      pageSize: params.pageSize,
    };

    return of(response).pipe(delay(300));
  }

  getOrderById(id: string): Observable<Order | undefined> {
    const order = this.mockOrders.find((o) => o.id === id);
    return of(order).pipe(delay(200));
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<Order | undefined> {
    const order = this.mockOrders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      if (status === OrderStatus.COMPLETED) {
        order.completedDate = new Date();
      }
      this.ordersSignal.set([...this.mockOrders]);
      this.saveOrdersToStorage();
    }
    return of(order).pipe(delay(300));
  }

  updateOrder(id: string, updates: Partial<Order>): Observable<Order | undefined> {
    const index = this.mockOrders.findIndex((o) => o.id === id);
    if (index !== -1) {
      this.mockOrders[index] = { ...this.mockOrders[index], ...updates };
      this.ordersSignal.set([...this.mockOrders]);
      this.saveOrdersToStorage();
      return of(this.mockOrders[index]).pipe(delay(300));
    }
    return of(undefined).pipe(delay(300));
  }

  deleteOrder(id: string): Observable<boolean> {
    const index = this.mockOrders.findIndex((o) => o.id === id);
    if (index !== -1) {
      this.mockOrders.splice(index, 1);
      this.ordersSignal.set([...this.mockOrders]);
      this.saveOrdersToStorage();
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  createOrder(orderData: Partial<Order>): Observable<Order> {
    const newOrder: Order = {
      id: (this.mockOrders.length + 1).toString(),
      orderNumber: `ORD-${String(this.mockOrders.length + 1).padStart(6, '0')}`,
      customerName: orderData.customerName || 'Guest',
      customerEmail: orderData.customerEmail || '',
      storeId: orderData.storeId || '',
      storeName: orderData.storeName || '',
      items: orderData.items || [],
      total: orderData.total || 0,
      status: OrderStatus.PENDING,
      paymentMethod: orderData.paymentMethod || PaymentMethod.CASH,
      orderDate: new Date(),
      completedDate: undefined,
    };

    this.mockOrders.unshift(newOrder);
    this.ordersSignal.set([...this.mockOrders]);
    this.saveOrdersToStorage();

    return of(newOrder).pipe(delay(300));
  }
}

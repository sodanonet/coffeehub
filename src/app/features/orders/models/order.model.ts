export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  orderDate: Date;
  completedDate?: Date;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  customizations?: string[];
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  MOBILE_PAY = 'MOBILE_PAY',
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  storeId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

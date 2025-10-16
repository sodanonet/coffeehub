export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

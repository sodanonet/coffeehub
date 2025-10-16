export interface Store {
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  manager: string;
  openingHours: string;
  status: StoreStatus;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
  hours?: string; // Optional field for display purposes
}

export enum StoreStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  MAINTENANCE = 'MAINTENANCE',
}

export interface CreateStoreDto {
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  manager: string;
  openingHours: string;
  capacity: number;
}

export interface UpdateStoreDto extends Partial<CreateStoreDto> {
  status?: StoreStatus;
}

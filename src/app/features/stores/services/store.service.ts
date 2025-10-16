import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Store, CreateStoreDto, UpdateStoreDto, StoreStatus } from '../models/store.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private storesSignal = signal<Store[]>([]);
  readonly stores = this.storesSignal.asReadonly();

  private mockStores: Store[] = [
    {
      id: '1',
      name: 'Downtown Store',
      location: 'Main Street',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '(555) 123-4567',
      email: 'downtown@coffeehub.com',
      manager: 'John Smith',
      openingHours: '6:00 AM - 10:00 PM',
      status: StoreStatus.OPEN,
      capacity: 50,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Airport Branch',
      location: 'Terminal 1',
      address: '100 Airport Rd',
      city: 'New York',
      state: 'NY',
      zipCode: '10022',
      phone: '(555) 234-5678',
      email: 'airport@coffeehub.com',
      manager: 'Sarah Johnson',
      openingHours: '5:00 AM - 11:00 PM',
      status: StoreStatus.OPEN,
      capacity: 30,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
    },
    {
      id: '3',
      name: 'University Campus',
      location: 'Student Center',
      address: '456 College Ave',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      phone: '(555) 345-6789',
      email: 'campus@coffeehub.com',
      manager: 'Emily Chen',
      openingHours: '7:00 AM - 9:00 PM',
      status: StoreStatus.OPEN,
      capacity: 40,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
    },
  ];

  constructor() {
    this.storesSignal.set([...this.mockStores]);
  }

  getStores(): Observable<Store[]> {
    return of([...this.mockStores]).pipe(delay(300));
  }

  getStoreById(id: string): Observable<Store> {
    const store = this.mockStores.find((s) => s.id === id);
    if (!store) {
      return throwError(() => new Error('Store not found'));
    }
    return of({ ...store }).pipe(delay(200));
  }

  createStore(dto: CreateStoreDto): Observable<Store> {
    const newStore: Store = {
      id: (this.mockStores.length + 1).toString(),
      ...dto,
      status: StoreStatus.OPEN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockStores.push(newStore);
    this.storesSignal.set([...this.mockStores]);

    return of(newStore).pipe(delay(400));
  }

  updateStore(id: string, dto: UpdateStoreDto): Observable<Store> {
    const index = this.mockStores.findIndex((s) => s.id === id);
    if (index === -1) {
      return throwError(() => new Error('Store not found'));
    }

    const updatedStore: Store = {
      ...this.mockStores[index],
      ...dto,
      updatedAt: new Date(),
    };

    this.mockStores[index] = updatedStore;
    this.storesSignal.set([...this.mockStores]);

    return of(updatedStore).pipe(delay(400));
  }

  deleteStore(id: string): Observable<void> {
    const index = this.mockStores.findIndex((s) => s.id === id);
    if (index === -1) {
      return throwError(() => new Error('Store not found'));
    }

    this.mockStores.splice(index, 1);
    this.storesSignal.set([...this.mockStores]);

    return of(void 0).pipe(delay(300));
  }

  searchStores(query: string): Observable<Store[]> {
    const filtered = this.mockStores.filter(
      (store) =>
        store.name.toLowerCase().includes(query.toLowerCase()) ||
        store.location.toLowerCase().includes(query.toLowerCase()) ||
        store.city.toLowerCase().includes(query.toLowerCase()),
    );

    return of(filtered).pipe(delay(200));
  }
}

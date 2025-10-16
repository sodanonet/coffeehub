import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay, throwError } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  private currentUserSignal = signal<User | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();

  // Mock user database
  private mockUsers = new Map<string, { password: string; user: User }>([
    [
      'admin',
      {
        password: 'admin123',
        user: {
          id: '1',
          username: 'admin',
          email: 'admin@coffeehub.com',
          role: UserRole.ADMIN,
          firstName: 'Admin',
          lastName: 'User',
        },
      },
    ],
    [
      'manager',
      {
        password: 'manager123',
        user: {
          id: '2',
          username: 'manager',
          email: 'manager@coffeehub.com',
          role: UserRole.MANAGER,
          firstName: 'Manager',
          lastName: 'User',
        },
      },
    ],
    [
      'staff',
      {
        password: 'staff123',
        user: {
          id: '3',
          username: 'staff',
          email: 'staff@coffeehub.com',
          role: UserRole.STAFF,
          firstName: 'Staff',
          lastName: 'User',
        },
      },
    ],
  ]);

  login(username: string, password: string): Observable<User> {
    const userRecord = this.mockUsers.get(username);

    if (!userRecord || userRecord.password !== password) {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(500));
    }

    const user = userRecord.user;
    this.currentUserSignal.set(user);
    this.saveUserToStorage(user);

    return of(user).pipe(delay(500));
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.removeUserFromStorage();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.currentUser()?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSignal.set(user);
      } catch (error) {
        console.error('Failed to parse user from storage:', error);
        this.removeUserFromStorage();
      }
    }
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private removeUserFromStorage(): void {
    localStorage.removeItem('currentUser');
  }

  refreshToken(): Observable<boolean> {
    // Mock token refresh
    return of(true).pipe(delay(300));
  }
}

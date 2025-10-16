import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerHeader } from '../../shared/components/customer-header/customer-header';
import { Button } from '../../shared/components/button/button';
import { Card } from '../../shared/components/card/card';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, CustomerHeader, Button, Card],
  templateUrl: './order-confirmation.html',
})
export class OrderConfirmation {
  private router = inject(Router);

  protected readonly orderNumber = this.generateOrderNumber();

  private generateOrderNumber(): string {
    return `ORD-${Date.now().toString().slice(-6)}`;
  }

  protected goHome(): void {
    this.router.navigate(['/']);
  }

  protected orderAgain(): void {
    this.router.navigate(['/order/menu']);
  }
}

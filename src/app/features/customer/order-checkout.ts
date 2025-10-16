import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../orders/services/order.service';
import { CustomerHeader } from '../../shared/components/customer-header/customer-header';
import { Button } from '../../shared/components/button/button';
import { Card } from '../../shared/components/card/card';

@Component({
  selector: 'app-order-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomerHeader, Button, Card],
  templateUrl: './order-checkout.html',
})
export class OrderCheckout {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  protected readonly cartItems = this.cartService.items;
  protected readonly cartTotal = this.cartService.total;
  protected readonly submitting = signal(false);

  protected checkoutForm: FormGroup;

  constructor() {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      paymentMethod: ['CREDIT_CARD', Validators.required],
    });
  }

  protected updateQuantity(index: number, quantity: number): void {
    this.cartService.updateQuantity(index, quantity);
  }

  protected removeItem(index: number): void {
    this.cartService.removeItem(index);
  }

  protected goToMenu(): void {
    this.router.navigate(['/order/menu']);
  }

  protected placeOrder(): void {
    if (this.checkoutForm.invalid) return;

    this.submitting.set(true);

    // Simulate order placement
    setTimeout(() => {
      this.cartService.clear();
      this.router.navigate(['/order/confirmation']);
    }, 1500);
  }
}

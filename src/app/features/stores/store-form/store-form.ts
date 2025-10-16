import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store.service';
import { Button } from '../../../shared/components/button/button';
import { Card } from '../../../shared/components/card/card';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, Card],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './store-form.html',
})
export class StoreForm implements OnInit {
  private fb = inject(FormBuilder);
  private storeService = inject(StoreService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected storeForm: FormGroup;
  protected readonly isEditMode = signal(false);
  protected readonly submitting = signal(false);
  private storeId: string | null = null;

  constructor() {
    this.storeForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      manager: ['', Validators.required],
      openingHours: ['', Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.storeId = this.route.snapshot.paramMap.get('id');
    if (this.storeId) {
      this.isEditMode.set(true);
      this.loadStore(this.storeId);
    }
  }

  private loadStore(id: string): void {
    this.storeService.getStoreById(id).subscribe({
      next: (store) => {
        this.storeForm.patchValue(store);
      },
      error: (error) => {
        console.error('Error loading store:', error);
        alert('Store not found');
        this.router.navigate(['/admin/stores']);
      },
    });
  }

  protected onSubmit(): void {
    if (this.storeForm.invalid) return;

    this.submitting.set(true);
    const formValue = this.storeForm.value;

    const operation = this.isEditMode()
      ? this.storeService.updateStore(this.storeId!, formValue)
      : this.storeService.createStore(formValue);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/admin/stores']);
      },
      error: (error) => {
        console.error('Error saving store:', error);
        alert('Failed to save store');
        this.submitting.set(false);
      },
    });
  }

  protected onCancel(): void {
    this.router.navigate(['/admin/stores']);
  }
}

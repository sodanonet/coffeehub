import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from '../services/menu.service';
import { MenuCategory } from '../models/menu.model';
import { Button } from '../../../shared/components/button/button';
import { Card } from '../../../shared/components/card/card';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, Card],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-form.html',
})
export class MenuForm implements OnInit {
  private fb = inject(FormBuilder);
  private menuService = inject(MenuService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected menuForm: FormGroup;
  protected readonly isEditMode = signal(false);
  protected readonly submitting = signal(false);
  private menuItemId: string | null = null;
  protected readonly categories = Object.values(MenuCategory);

  constructor() {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      calories: [0, [Validators.required, Validators.min(0)]],
      prepTime: [0, [Validators.required, Validators.min(1)]],
      sizes: this.fb.array([]),
      ingredientsText: ['', Validators.required],
    });
  }

  get sizes(): FormArray {
    return this.menuForm.get('sizes') as FormArray;
  }

  ngOnInit(): void {
    this.menuItemId = this.route.snapshot.paramMap.get('id');
    if (this.menuItemId) {
      this.isEditMode.set(true);
      this.loadMenuItem(this.menuItemId);
    } else {
      this.addSize();
    }
  }

  private loadMenuItem(id: string): void {
    this.menuService.getMenuItemById(id).subscribe({
      next: (item) => {
        this.menuForm.patchValue({
          name: item.name,
          description: item.description,
          category: item.category,
          price: item.price,
          calories: item.calories,
          prepTime: item.prepTime,
          ingredientsText: item.ingredients.join(', '),
        });

        item.sizes.forEach((size) => {
          this.sizes.push(
            this.fb.group({
              name: [size.name],
              ounces: [size.ounces],
              price: [size.price],
            }),
          );
        });
      },
      error: (error) => {
        console.error('Error loading menu item:', error);
        this.router.navigate(['/admin/menu']);
      },
    });
  }

  protected addSize(): void {
    this.sizes.push(
      this.fb.group({
        name: ['', Validators.required],
        ounces: [0, Validators.required],
        price: [0, Validators.required],
      }),
    );
  }

  protected removeSize(index: number): void {
    this.sizes.removeAt(index);
  }

  protected onSubmit(): void {
    if (this.menuForm.invalid) return;

    this.submitting.set(true);
    const formValue = this.menuForm.value;
    const dto = {
      ...formValue,
      ingredients: formValue.ingredientsText.split(',').map((i: string) => i.trim()),
    };
    delete dto.ingredientsText;

    const operation = this.isEditMode()
      ? this.menuService.updateMenuItem(this.menuItemId!, dto)
      : this.menuService.createMenuItem(dto);

    operation.subscribe({
      next: () => this.router.navigate(['/admin/menu']),
      error: (error) => {
        console.error('Error saving menu item:', error);
        this.submitting.set(false);
      },
    });
  }

  protected onCancel(): void {
    this.router.navigate(['/admin/menu']);
  }
}

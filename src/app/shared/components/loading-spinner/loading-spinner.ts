import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loading-spinner.html',
})
export class LoadingSpinner {
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly message = input<string>();
}

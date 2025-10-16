import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.html',
})
export class Modal {
  readonly title = input('');
  readonly isOpen = input(false);
  readonly hasFooter = input(true);
  readonly closed = output<void>();

  protected close(): void {
    this.closed.emit();
  }
}

import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.html',
})
export class Button {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly variant = input<'primary' | 'secondary' | 'danger' | 'outline'>('primary');
  readonly disabled = input(false);
  readonly clicked = output<Event>();

  protected readonly buttonClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = '';
    const variantClasses = {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-500 text-white',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100'
    };
    return `${baseClasses} ${variantClasses[variant]}`;
  });

  protected handleClick(event: Event): void {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }
}

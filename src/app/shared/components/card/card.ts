import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.html',
})
export class Card {
  readonly title = input<string>();
  readonly elevated = input(false);
  readonly hasFooter = input(false);
}

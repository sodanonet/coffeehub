import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormat implements PipeTransform {
  transform(value: number, currencySymbol = '$'): string {
    return `${currencySymbol}${value.toFixed(2)}`;
  }
}

import { Component, output, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.html',
})
export class Table {
  readonly columns = input<TableColumn[]>([]);
  readonly data = input<never[]>([]);
  readonly hasActions = input(false);
  readonly sorted = output<{ key: string; direction: 'asc' | 'desc' }>();

  protected sortKey = '';
  protected sortDirection: 'asc' | 'desc' = 'asc';

  protected sort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.sorted.emit({ key, direction: this.sortDirection });
  }
}

import { Directive, ElementRef, HostListener, input, inject } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class Highlight {
  readonly appHighlight = input('#fef3c7');
  readonly defaultColor = input('transparent');

  private readonly el = inject(ElementRef);

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight());
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(this.defaultColor());
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}

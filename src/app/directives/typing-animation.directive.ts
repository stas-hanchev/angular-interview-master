import { Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Directive({
  selector: '[appTypingAnimation]',
  standalone: true,
})
export class TypingAnimationDirective implements OnChanges, OnDestroy {
  @Input() appTypingAnimation: string = '';
  @Input() typingSpeed: number = 10;
  @Input() charsPerStep: number = 4;

  private typingSubscription?: Subscription;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appTypingAnimation']) {
      this.typeText();
    }
  }

  ngOnDestroy(): void {
    this.typingSubscription?.unsubscribe();
  }

  private typeText() {
    this.typingSubscription?.unsubscribe();

    const text = this.appTypingAnimation;
    this.renderer.setProperty(this.el.nativeElement, 'textContent', '');

    this.typingSubscription = interval(this.typingSpeed)
      .pipe(
        map((step) => (step + 1) * this.charsPerStep),
        takeWhile((length) => length < text.length, true)
      )
      .subscribe((length) => {
        this.renderer.setProperty(
          this.el.nativeElement,
          'textContent',
          text.slice(0, length)
        );
      });
  }
}

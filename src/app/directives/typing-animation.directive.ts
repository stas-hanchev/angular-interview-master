import { Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription, from, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

@Directive({
  selector: '[appTypingAnimation]',
  standalone: true,
})
export class TypingAnimationDirective implements OnChanges, OnDestroy {
  @Input() appTypingAnimation: string = '';
  @Input() typingSpeed: number = 50; // Speed in ms between each character

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
    const textArray = text.split('');
    this.renderer.setProperty(this.el.nativeElement, 'textContent', '');

    this.typingSubscription = from(textArray)
      .pipe(
        concatMap(char => of(char).pipe(delay(this.typingSpeed)))
      )
      .subscribe({
        next: (char) => {
          this.renderer.setProperty(
            this.el.nativeElement,
            'textContent',
            this.el.nativeElement.textContent + char
          );
        }
      });
  }
}

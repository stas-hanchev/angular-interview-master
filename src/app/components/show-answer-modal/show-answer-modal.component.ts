import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionItem } from '../category/category.component.config';
import { MatButtonModule } from '@angular/material/button';
import { TypingAnimationDirective } from '../../directives/typing-animation.directive';

@Component({
  selector: 'app-show-answer-modal',
  standalone: true,
  imports: [MatButtonModule, TypingAnimationDirective],
  templateUrl: './show-answer-modal.component.html',
  styleUrl: './show-answer-modal.component.scss',
})
export class ShowAnswerModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ShowAnswerModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: Pick<QuestionItem, 'question' | 'answer'>
  ) {}

  close() {
    this.dialogRef.close();
  }
}

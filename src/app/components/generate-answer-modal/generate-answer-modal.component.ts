import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionItem } from '../category/category.component.config';
import { MatButtonModule } from '@angular/material/button';
import { TypingAnimationDirective } from '../../directives/typing-animation.directive';

@Component({
  selector: 'app-generate-answer-modal',
  standalone: true,
  imports: [MatButtonModule, TypingAnimationDirective],
  templateUrl: './generate-answer-modal.component.html',
  styleUrl: './generate-answer-modal.component.scss',
})
export class GenerateAnswerModalComponent {
  constructor(
    public dialogRef: MatDialogRef<GenerateAnswerModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: Pick<QuestionItem, 'question' | 'answer'>
  ) {}

  saveAnswer() {
    this.dialogRef.close(this.data.answer);
  }
}
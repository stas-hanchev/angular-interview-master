import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Subject, filter, switchMap, takeUntil } from 'rxjs';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { QuestionItem } from '../category/category.component.config';
import { GenerateAnswerModalComponent } from '../generate-answer-modal/generate-answer-modal.component';
import { PreparationService } from '../../services/preparation.service';

@Component({
  selector: 'app-preparation',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './preparation.component.html',
  styleUrl: './preparation.component.scss',
})
export class PreparationComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'question', 'actions'];
  dataSource = new MatTableDataSource<QuestionItem>();
  category: string = '';
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private preparationService: PreparationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        switchMap((params) => {
          this.category = params.get('tabName') || 'angular';
          this.isLoading = true;
          return this.preparationService.getPreparationQuestionsByCategory(
            this.category
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        this.isLoading = false;
        this.dataSource.data = response.data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openGenerateDialog(question: QuestionItem): void {
    const dialogRef = this.dialog.open(GenerateAnswerModalComponent, {
      width: '500px',
      data: {
        question: question.question,
        answer: question.answer,
      }
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((answer: string | undefined): answer is string => !!answer),
        switchMap((answer) =>
          this.preparationService.updatePreparationQuestionById(
            this.category,
            { answer },
            question.id
          )
        )
      )
      .subscribe((response) => {
        this.dataSource.data = this.dataSource.data.map((item) =>
          item.id === response.data.id ? response.data : item
        );
      });
  }

  openDeleteDialog(question: QuestionItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '333px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() =>
          this.preparationService.deletePreparationQuestionById(
            this.category,
            question.id
          )
        )
      )
      .subscribe((response) => {
        this.dataSource.data = this.dataSource.data.filter(
          (item) => item.id !== response.data.id
        );
      });
  }
}

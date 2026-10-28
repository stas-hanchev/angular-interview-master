import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';
import { QuestionItem } from '../category/category.component.config';
import { ShowAnswerModalComponent } from '../show-answer-modal/show-answer-modal.component';
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
          return this.preparationService
            .getPreparationQuestionsByCategory(this.category)
            .pipe(catchError(() => of({ data: [] })));
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

  openAnswerDialog(question: QuestionItem): void {
    this.dialog.open(ShowAnswerModalComponent, {
      width: '500px',
      data: {
        question: question.question,
        answer: question.answer,
      },
    });
  }
}

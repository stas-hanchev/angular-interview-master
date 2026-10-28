import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { QuestionItem } from './category.component.config';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShowAnswerModalComponent } from '../show-answer-modal/show-answer-modal.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'question', 'actions'];
  dataSource = new MatTableDataSource<QuestionItem>();
  category: string = '';
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((param) => {
          this.category = param.get('categoryId') || '';
          this.isLoading = true;
          return this.categoriesService
            .getQuestionsByCategory(this.category)
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

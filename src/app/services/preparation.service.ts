import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import {
  QuestionItem,
  getQuestionsByCategory,
} from '../components/category/category.component.config';
import { Response, ResponseArray } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class PreparationService {
  public baseUrl = 'http://localhost:4200';

  constructor(private http: HttpClient) {}

  getPreparationQuestionsByCategory(
    categoryName: string
  ): Observable<ResponseArray<QuestionItem>> {
    return of({
      data: [...getQuestionsByCategory(categoryName)],
    }).pipe(delay(500));

    // return this.http.get<ResponseArray<QuestionItem>>(
    //   `${this.baseUrl}/preparation/${categoryName}`
    // );
  }

  updatePreparationQuestionById(
    categoryName: string,
    question: Partial<QuestionItem>,
    id: number
  ): Observable<Response<QuestionItem>> {
    const existing = getQuestionsByCategory(categoryName).find(
      (item) => item.id === id
    );

    if (!existing) {
      return throwError(
        () => new Error(`Question ${id} not found in category ${categoryName}`)
      );
    }

    Object.assign(existing, question, { id });
    return of({ data: { ...existing } }).pipe(delay(500));

    // return this.http.patch<Response<QuestionItem>>(
    //   `${this.baseUrl}/category/${categoryName}/${id}`,
    //   { ...question }
    // );
  }

  deletePreparationQuestionById(
    categoryName: string,
    id: number
  ): Observable<Response<QuestionItem>> {
    const deleted = getQuestionsByCategory(categoryName).find(
      (question) => question.id === id
    );

    if (!deleted) {
      return throwError(
        () => new Error(`Question ${id} not found in category ${categoryName}`)
      );
    }

    return of({ data: { ...deleted } }).pipe(delay(500));

    // return this.http.delete<Response<QuestionItem>>(
    //   `${this.baseUrl}/preparation/${categoryName}/${id}`
    // );
  }
}

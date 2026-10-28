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
export class CategoriesService {
  public baseUrl = 'http://localhost:4200';

  constructor(private http: HttpClient) {}

  getQuestionsByCategory(
    categoryName: string
  ): Observable<ResponseArray<QuestionItem>> {
    return of({
      data: [...getQuestionsByCategory(categoryName)],
    }).pipe(delay(500));

    // return this.http.get<ResponseArray<QuestionItem>>(
    //   `${this.baseUrl}/category/${categoryName}`
    // );
  }

  deleteCategoryQuestionById(
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
    //   `${this.baseUrl}/category/${categoryName}/${id}`
    // );
  }
}

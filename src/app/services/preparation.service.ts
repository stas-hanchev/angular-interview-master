import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, map } from 'rxjs';
import { QuestionItem } from '../components/category/category.component.config';
import { CategoryResponse, ResponseArray } from '../models/response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreparationService {
  public baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPreparationQuestionsByCategory(
    categoryName: string
  ): Observable<ResponseArray<QuestionItem>> {
    return this.http
      .get<CategoryResponse[]>(`${this.baseUrl}/preparation/${categoryName}`)
      .pipe(
        map((response) => ({ data: response[0]?.questions || [] })),
        delay(500)
      );
  }
}

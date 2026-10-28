import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, map } from 'rxjs';
import { QuestionItem } from '../components/category/category.component.config';
import { ResponseArray } from '../models/response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  public baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getQuestionsByCategory(
    categoryName: string
  ): Observable<ResponseArray<QuestionItem>> {
    return this.http
      .get<ResponseArray<QuestionItem>>(
        `${this.baseUrl}/category/${categoryName}`
      )
      .pipe(
        map((response: any) => {
          return { data: response[0]?.questions || [] };
        }),
        delay(500)
      );
  }
}

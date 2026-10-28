import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable, tap } from 'rxjs';
import { UserLoginResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  private apiUrl = 'http://localhost:3000';

  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  login(email: string, password: string): Observable<UserLoginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ email, password });

    return this.http.post<UserLoginResponse>(`${this.apiUrl}/login`, body, { headers }).pipe(
      tap((response) => {
        if (response.accessToken) {
          this.storageService.setToken(response.accessToken);
          this.storageService.setUser(response.user);
        }
      })
    );
  }
}

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../services/storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    private storageService: StorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage =
          typeof error.error === 'string' && error.error
            ? error.error
            : error.status === 0
              ? 'Server is unavailable'
              : 'An unknown error occurred!';

        if (error.status === HttpStatusCode.Unauthorized) {
          this.storageService.clearSession();
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }
}

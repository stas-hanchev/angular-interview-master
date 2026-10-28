import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/response.model';

export type StoredUser = Omit<User, 'password'>;

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'authUser';
  private tokenSubject: BehaviorSubject<string | null>;
  private userSubject: BehaviorSubject<StoredUser | null>;

  constructor() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    this.tokenSubject = new BehaviorSubject<string | null>(token);
    this.userSubject = new BehaviorSubject<StoredUser | null>(
      token ? this.readUser() : null
    );
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getTokenObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.tokenSubject.next(null);
  }

  setUser(user: User | StoredUser): void {
    const { password, ...storedUser } = user as User;
    localStorage.setItem(this.USER_KEY, JSON.stringify(storedUser));
    this.userSubject.next(storedUser);
  }

  getUserObservable(): Observable<StoredUser | null> {
    return this.userSubject.asObservable();
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
  }

  clearSession(): void {
    this.removeToken();
    this.removeUser();
  }

  private readUser(): StoredUser | null {
    try {
      return JSON.parse(localStorage.getItem(this.USER_KEY) ?? 'null');
    } catch {
      return null;
    }
  }
}

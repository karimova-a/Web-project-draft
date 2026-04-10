import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/`, { username, email, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ access: string; refresh: string }>(
      `${this.baseUrl}/login/`, { username, password }
    ).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        this.loggedIn.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}

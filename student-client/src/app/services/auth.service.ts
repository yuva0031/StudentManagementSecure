import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'https://localhost:64638/api/auth';
  private isBrowser: boolean;

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  initAuthAfterHydration() {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('token');
    this.loggedInSubject.next(!!token);
  }


  saveToken(token: string) {
    if (!this.isBrowser) return;

    localStorage.setItem('token', token);
    this.loggedInSubject.next(true);
  }

  logout() {
    if (!this.isBrowser) return;

    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  isBrowserEnv(): boolean {
    return this.isBrowser;
  }
}
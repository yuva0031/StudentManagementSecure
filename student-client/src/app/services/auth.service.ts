import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'https://localhost:64638/api/auth';
  private isBrowser: boolean;

  isLoggedIn = signal(false);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.isLoggedIn.set(!!localStorage.getItem('token'));
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  saveToken(token: string) {
    if (!this.isBrowser) return;
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);
  }

  logout() {
    if (!this.isBrowser) return;
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private token: string | null = null;
  private user: number | null = null;

  constructor() {}

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  setUser(userId: number): void {
    this.user = userId;
  }

  getUser(): string | null {
    return localStorage.getItem('userDetails');
  }
}

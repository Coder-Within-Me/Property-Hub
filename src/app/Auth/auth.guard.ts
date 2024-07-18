import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor( private router: Router) {}

  canActivate(): boolean {
    if (this.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/signin']);
      return false;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken') && !!localStorage.getItem('userDetails');
  }
}

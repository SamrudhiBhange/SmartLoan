import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  get currentUserValue(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).user : null;
  }

  get isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'Admin';
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
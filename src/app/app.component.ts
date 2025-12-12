import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SmartLoan';
  isLoggedIn = false;
  isAdmin = false;
  currentUser: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Check login status on initialization
    this.checkAuthStatus();
    
    // Listen for auth changes (simplified)
    this.currentUser = this.authService.currentUserValue;
    this.isLoggedIn = this.authService.isLoggedIn;
    this.isAdmin = this.authService.isAdmin;
  }

  checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.currentUser = this.authService.currentUserValue;
    this.isAdmin = this.authService.isAdmin;
  }

  logout(): void {
    this.authService.logout();
    this.checkAuthStatus();
  }
}
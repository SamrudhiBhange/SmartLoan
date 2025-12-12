import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoanService } from '../services/loan.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // User data
  currentUser: any;
  
  // Loan data
  myLoans: any[] = [];
  isLoading = false;
  
  // Stats
  totalLoans = 0;
  paidAmount = 0;
  pendingAmount = 0;
  approvedLoans = 0;
  rejectedLoans = 0;
  
  // EMI Calculator
  showEMICalculator = false;
  emiAmount = 10000;
  emiRate = 10;
  emiMonths = 12;
  emiResult: any = null;
  calculatingEMI = false;

  constructor(
    public authService: AuthService,
    private loanService: LoanService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadMyLoans();
  }

  loadMyLoans(): void {
    this.isLoading = true;
    this.loanService.getMyLoans().subscribe({
      next: (loans: any) => {
        this.myLoans = loans;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading loans:', error);
        this.isLoading = false;
        this.myLoans = []; // Default empty array
      }
    });
  }

  calculateStats(): void {
    this.totalLoans = this.myLoans.length;
    this.paidAmount = 0;
    this.pendingAmount = 0;
    this.approvedLoans = 0;
    this.rejectedLoans = 0;

    this.myLoans.forEach(loan => {
      if (loan.status === 'Paid' || loan.status === 'Active') {
        this.paidAmount += loan.totalRepayment || loan.principalAmount || 0;
      } else if (loan.status === 'Pending' || loan.status === 'Approved') {
        this.pendingAmount += loan.totalRepayment || loan.principalAmount || 0;
      }

      if (loan.status === 'Approved') {
        this.approvedLoans++;
      } else if (loan.status === 'Rejected') {
        this.rejectedLoans++;
      }
    });
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString();
  }

  calculateEMI(): void {
    this.showEMICalculator = true;
  }

  calculateEMINow(): void {
    this.calculatingEMI = true;
    this.loanService.calculateEMI(this.emiAmount, this.emiRate, this.emiMonths).subscribe({
      next: (result: any) => {
        this.emiResult = result;
        this.calculatingEMI = false;
      },
      error: (error: any) => {
        console.error('Error calculating EMI:', error);
        this.calculatingEMI = false;
        this.emiResult = null;
      }
    });
  }

  closeEMICalculator(): void {
    this.showEMICalculator = false;
    this.emiResult = null;
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'badge bg-success';
      case 'pending': return 'badge bg-warning';
      case 'rejected': return 'badge bg-danger';
      case 'active': return 'badge bg-primary';
      case 'paid': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoanService } from '../services/loan.service';

@Component({
  selector: 'app-apply-loan',
  templateUrl: './apply-loan.component.html',
  styleUrls: ['./apply-loan.component.css']
})
export class ApplyLoanComponent {
  // Loan application fields
  principalAmount: number = 10000;
  loanTermMonths: number = 12;
  interestRate: number = 10;
  
  // EMI Calculation
  emiResult: any = null;
  calculatingEMI = false;
  
  // UI State
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private loanService: LoanService,
    private router: Router
  ) { }

  calculateEMI(): void {
    this.calculatingEMI = true;
    this.emiResult = null;
    this.errorMessage = '';

    this.loanService.calculateEMI(this.principalAmount, this.interestRate, this.loanTermMonths).subscribe({
      next: (result: any) => {
        this.emiResult = result;
        this.calculatingEMI = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to calculate EMI. Please check your inputs.';
        this.calculatingEMI = false;
        console.error('EMI calculation error:', error);
      }
    });
  }

  applyForLoan(): void {
    // Validation
    if (this.principalAmount < 1000 || this.principalAmount > 1000000) {
      this.errorMessage = 'Loan amount must be between $1,000 and $1,000,000';
      return;
    }

    if (this.loanTermMonths < 6 || this.loanTermMonths > 360) {
      this.errorMessage = 'Loan term must be between 6 and 360 months';
      return;
    }

    if (this.interestRate < 1 || this.interestRate > 30) {
      this.errorMessage = 'Interest rate must be between 1% and 30%';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const loanData = {
      principalAmount: this.principalAmount,
      loanTermMonths: this.loanTermMonths,
      interestRate: this.interestRate
    };

    this.loanService.applyForLoan(loanData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Loan application submitted successfully! Redirecting to dashboard...';

        // Redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to apply for loan. Please try again.';
      }
    });
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
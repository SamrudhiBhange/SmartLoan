import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats, Loan, ApiResponse } from '../models/api-responses.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  // ========== CUSTOMER METHODS ==========
  
  calculateEMI(principal: number, rate: number, months: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/loans/calculate-emi`, {
      params: { principal, rate, months }
    });
  }

  applyForLoan(loanData: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/loans/apply`, {loanData});
  }

  getMyLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/loans/my-loans`);
  }

  getLoanStatus(loanId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/loans/status/${loanId}`);
  }

  // ========== ADMIN METHODS ==========
  
  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/admin/loans`);
  }

  // In loan.service.ts, add these methods with mock data
getDashboardStats(): Observable<any> {
  // Mock data
  const mockStats = {
    totalLoans: 25,
    pendingLoans: 5,
    approvedLoans: 10,
    activeLoans: 8,
    totalLoanAmount: 250000,
    totalPaidAmount: 100000,
    totalPendingAmount: 150000,
    monthlyStats: [
      { month: 'Jan', amount: 50000, count: 5 },
      { month: 'Feb', amount: 75000, count: 7 },
      { month: 'Mar', amount: 125000, count: 13 }
    ]
  };
  
  return new Observable(observer => {
    setTimeout(() => {
      observer.next(mockStats);
      observer.complete();
    }, 500);
  });
}

getPendingLoans(): Observable<any> {
  const mockLoans = [
    { id: 1, principalAmount: 10000, loanTermMonths: 12, interestRate: 10, status: 'Pending', user: { firstName: 'John', lastName: 'Doe' } },
    { id: 2, principalAmount: 20000, loanTermMonths: 24, interestRate: 12, status: 'Pending', user: { firstName: 'Jane', lastName: 'Smith' } }
  ];
  
  return new Observable(observer => {
    setTimeout(() => {
      observer.next(mockLoans);
      observer.complete();
    }, 500);
  });
}

  approveLoan(loanId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/admin/loans/${loanId}/approve`, {});
  }

  rejectLoan(loanId: number, reason: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/admin/loans/${loanId}/reject`, { rejectionReason: reason });
  }
  
}
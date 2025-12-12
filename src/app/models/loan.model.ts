export interface Loan {
  id: number;
  userId: number;
  principalAmount: number;
  loanTermMonths: number;
  interestRate: number;
  emiAmount?: number;
  totalRepayment?: number;
  status: string;
  startDate: string;
  approvedDate?: string;
  createdAt: string;
  user?: User;
}
export interface CreateLoanRequest {
  principalAmount: number;
  loanTermMonths: number;
  interestRate: number;
}

export interface LoanStatus {
  loanId: number;
  status: string;
  emiAmount?: number;
  totalRepayment?: number;
  amountPaid: number;
  amountPending: number;
  paymentsMade: number;
  paymentsRemaining: number;
  nextPaymentDate?: string;
}
export interface DashboardStats {
  totalLoans: number;
  pendingLoans: number;
  approvedLoans: number;
  activeLoans: number;
  totalLoanAmount: number;
  totalPaidAmount: number;
  totalPendingAmount: number;
  monthlyStats: MonthlyStat[];
}

export interface MonthlyStat {
  month: string;
  amount: number;
  count: number;
}
// Import User from user.model
import { User } from './user.model';
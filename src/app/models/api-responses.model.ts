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
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ApiResponse {
  message: string;
  success: boolean;
  data?: any;
}
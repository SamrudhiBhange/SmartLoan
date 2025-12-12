import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { LoanService } from '../services/loan.service';
import { AuthService } from '../services/auth.service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('statsChart') statsChartRef!: ElementRef;
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef;
  
  // Stats
  dashboardStats: any = {
    totalLoans: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    activeLoans: 0,
    totalLoanAmount: 0,
    totalPaidAmount: 0,
    totalPendingAmount: 0,
    monthlyStats: []
  };
  
  // Charts
  statsChart: any;
  monthlyChart: any;
  
  // UI State
  isLoading = true;
  pendingLoans: any[] = [];
  recentLoans: any[] = [];
  
  // Summary
  summary = {
    totalCustomers: 0,
    totalRevenue: 0,
    defaultRate: '2.5%'
  };

  constructor(
    public authService: AuthService,
    private loanService: LoanService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // Charts will be created after data loads
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load dashboard stats
    this.loanService.getDashboardStats().subscribe({
      next: (stats: any) => {
        this.dashboardStats = stats;
        this.createCharts();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading dashboard stats:', error);
        // Set default values if API fails
        this.setDefaultStats();
        this.isLoading = false;
      }
    });

    // Load pending loans
    this.loanService.getPendingLoans().subscribe({
      next: (loans: any) => {
        this.pendingLoans = Array.isArray(loans) ? loans.slice(0, 5) : [];
      },
      error: (error: any) => {
        console.error('Error loading pending loans:', error);
        this.pendingLoans = [];
      }
    });

    // Load recent loans
    this.loanService.getAllLoans().subscribe({
      next: (loans: any) => {
        this.recentLoans = Array.isArray(loans) ? loans.slice(0, 10) : [];
        this.calculateSummary();
      },
      error: (error: any) => {
        console.error('Error loading all loans:', error);
        this.recentLoans = [];
      }
    });
  }

  setDefaultStats(): void {
    // Set default values if API fails
    this.dashboardStats = {
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
    this.createCharts();
  }

  calculateSummary(): void {
    // Calculate unique users
    const uniqueUsers = new Set(this.recentLoans.map(loan => loan.userId || loan.user?.id));
    this.summary.totalCustomers = uniqueUsers.size;
    
    // Calculate total revenue (simplified - 2% of total loan amount)
    this.summary.totalRevenue = this.dashboardStats.totalLoanAmount * 0.02;
  }

  createCharts(): void {
    // Destroy existing charts
    if (this.statsChart) {
      this.statsChart.destroy();
    }
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }

    // Create Loan Status Chart
    const statsCtx = this.statsChartRef.nativeElement.getContext('2d');
    this.statsChart = new Chart(statsCtx, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Approved', 'Active', 'Paid'],
        datasets: [{
          data: [
            this.dashboardStats.pendingLoans || 0,
            this.dashboardStats.approvedLoans || 0,
            this.dashboardStats.activeLoans || 0,
            (this.dashboardStats.totalLoans || 0) - 
              ((this.dashboardStats.pendingLoans || 0) + 
               (this.dashboardStats.approvedLoans || 0) + 
               (this.dashboardStats.activeLoans || 0))
          ],
          backgroundColor: [
            'rgba(255, 193, 7, 0.8)',
            'rgba(40, 167, 69, 0.8)',
            'rgba(0, 123, 255, 0.8)',
            'rgba(108, 117, 125, 0.8)'
          ],
          borderColor: [
            'rgb(255, 193, 7)',
            'rgb(40, 167, 69)',
            'rgb(0, 123, 255)',
            'rgb(108, 117, 125)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Loan Status Distribution'
          }
        }
      }
    });

    // Create Monthly Stats Chart
    if (this.dashboardStats.monthlyStats && this.dashboardStats.monthlyStats.length > 0) {
      const monthlyCtx = this.monthlyChartRef.nativeElement.getContext('2d');
      this.monthlyChart = new Chart(monthlyCtx, {
        type: 'bar',
        data: {
          labels: this.dashboardStats.monthlyStats.map((stat: any) => stat.month),
          datasets: [
            {
              label: 'Loan Amount ($)',
              data: this.dashboardStats.monthlyStats.map((stat: any) => stat.amount || 0),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            },
            {
              label: 'Number of Loans',
              data: this.dashboardStats.monthlyStats.map((stat: any) => stat.count || 0),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              type: 'line',
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount ($)'
              }
            },
            y1: {
              position: 'right',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Loans'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Monthly Loan Performance'
            }
          }
        }
      });
    }
  }

  formatCurrency(amount: number): string {
    return '$' + (amount || 0).toLocaleString();
  }

  formatNumber(num: number): string {
    return (num || 0).toLocaleString();
  }

  getStatusBadgeClass(status: string): string {
    if (!status) return 'badge bg-secondary';
    
    switch (status.toLowerCase()) {
      case 'approved': return 'badge bg-success';
      case 'pending': return 'badge bg-warning';
      case 'rejected': return 'badge bg-danger';
      case 'active': return 'badge bg-primary';
      case 'paid': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  }

  approveLoan(loanId: number): void {
    if (confirm('Are you sure you want to approve this loan?')) {
      this.loanService.approveLoan(loanId).subscribe({
        next: (response: any) => {
          alert(response.message || 'Loan approved successfully!');
          this.loadDashboardData(); // Refresh data
        },
        error: (error: any) => {
          alert('Error approving loan: ' + (error.error?.message || 'Unknown error'));
        }
      });
    }
  }

  rejectLoan(loanId: number): void {
    const reason = prompt('Please enter rejection reason:');
    if (reason && reason.trim()) {
      this.loanService.rejectLoan(loanId, reason).subscribe({
        next: (response: any) => {
          alert(response.message || 'Loan rejected successfully!');
          this.loadDashboardData(); // Refresh data
        },
        error: (error: any) => {
          alert('Error rejecting loan: ' + (error.error?.message || 'Unknown error'));
        }
      });
    }
  }

  viewAllLoans(): void {
    // Navigate to admin loans page (you can create this later)
    alert('Navigate to all loans page');
  }

  viewPendingLoans(): void {
    // Navigate to pending loans page
    alert('Navigate to pending loans page');
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  goToUserDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartLoan.API.DTOs
{
    public class CreateLoanRequest
    {
        [Required]
        [Range(1000, 1000000)]
        public decimal PrincipalAmount { get; set; }

        [Required]
        [Range(6, 360)]
        public int LoanTermMonths { get; set; }

        [Required]
        [Range(1, 30)]
        public decimal InterestRate { get; set; }
    }

    public class LoanDto
    {
        public int Id { get; set; }
        public decimal PrincipalAmount { get; set; }
        public int LoanTermMonths { get; set; }
        public decimal InterestRate { get; set; }
        public decimal? EMIAmount { get; set; }
        public decimal? TotalRepayment { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class LoanStatusDto
    {
        public int LoanId { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal? EMIAmount { get; set; }
        public decimal? TotalRepayment { get; set; }
    }

    public class DashboardStatsDto
    {
        public int TotalLoans { get; set; }
        public int PendingLoans { get; set; }
        public int ApprovedLoans { get; set; }
        public int ActiveLoans { get; set; }
        public decimal TotalLoanAmount { get; set; }
        public decimal TotalPaidAmount { get; set; }
        public decimal TotalPendingAmount { get; set; }
        public List<MonthlyStats> MonthlyStats { get; set; } = new List<MonthlyStats>();
    }

    public class MonthlyStats
    {
        public string Month { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public int Count { get; set; }
    }
}
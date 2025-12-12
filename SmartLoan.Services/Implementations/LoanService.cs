using Microsoft.EntityFrameworkCore;
using SmartLoan.API.DTOs;
using SmartLoan.Data;
using SmartLoan.Data.Models;
using SmartLoan.Services.Interfaces;

namespace SmartLoan.Services.Implementations
{
    public class LoanService : ILoanService
    {
        private readonly AppDbContext _context;

        public LoanService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Loan> CreateLoanAsync(int userId, CreateLoanRequest request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            // Calculate EMI
            decimal emi = CalculateEMI(request.PrincipalAmount, request.InterestRate, request.LoanTermMonths);
            decimal totalRepayment = emi * request.LoanTermMonths;

            var loan = new Loan
            {
                UserId = userId,
                PrincipalAmount = request.PrincipalAmount,
                LoanTermMonths = request.LoanTermMonths,
                InterestRate = request.InterestRate,
                StartDate = DateTime.UtcNow,
                Status = LoanStatus.Pending,
                EMIAmount = emi,
                TotalRepayment = totalRepayment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();

            return loan;
        }

        public async Task<LoanStatusDto> CheckLoanStatusAsync(int userId, int loanId)
        {
            var loan = await _context.Loans
                .FirstOrDefaultAsync(l => l.Id == loanId && l.UserId == userId);

            if (loan == null)
                throw new Exception("Loan not found");

            return new LoanStatusDto
            {
                LoanId = loan.Id,
                Status = loan.Status.ToString(),
                EMIAmount = loan.EMIAmount,
                TotalRepayment = loan.TotalRepayment
            };
        }

        public async Task<Loan> ApproveLoanAsync(int adminId, int loanId)
        {
            var loan = await _context.Loans.FindAsync(loanId);
            if (loan == null)
                throw new Exception("Loan not found");

            loan.Status = LoanStatus.Approved;
            loan.ApprovedDate = DateTime.UtcNow;
            loan.ApprovedByAdminId = adminId;
            loan.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return loan;
        }

        public async Task<Loan> RejectLoanAsync(int adminId, int loanId, string reason)
        {
            var loan = await _context.Loans.FindAsync(loanId);
            if (loan == null)
                throw new Exception("Loan not found");

            loan.Status = LoanStatus.Rejected;
            loan.RejectionReason = reason;
            loan.RejectedDate = DateTime.UtcNow;
            loan.ApprovedByAdminId = adminId;
            loan.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return loan;
        }

        public async Task<List<LoanDto>> GetUserLoansAsync(int userId)
        {
            return await _context.Loans
                .Where(l => l.UserId == userId)
                .Select(l => new LoanDto
                {
                    Id = l.Id,
                    PrincipalAmount = l.PrincipalAmount,
                    LoanTermMonths = l.LoanTermMonths,
                    InterestRate = l.InterestRate,
                    EMIAmount = l.EMIAmount,
                    TotalRepayment = l.TotalRepayment,
                    Status = l.Status.ToString(),
                    StartDate = l.StartDate,
                    CreatedAt = l.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<List<LoanDto>> GetAllLoansAsync()
        {
            return await _context.Loans
                .Select(l => new LoanDto
                {
                    Id = l.Id,
                    PrincipalAmount = l.PrincipalAmount,
                    LoanTermMonths = l.LoanTermMonths,
                    InterestRate = l.InterestRate,
                    EMIAmount = l.EMIAmount,
                    TotalRepayment = l.TotalRepayment,
                    Status = l.Status.ToString(),
                    StartDate = l.StartDate,
                    CreatedAt = l.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<List<LoanDto>> GetPendingLoansAsync()
        {
            return await _context.Loans
                .Where(l => l.Status == LoanStatus.Pending)
                .Select(l => new LoanDto
                {
                    Id = l.Id,
                    PrincipalAmount = l.PrincipalAmount,
                    LoanTermMonths = l.LoanTermMonths,
                    InterestRate = l.InterestRate,
                    EMIAmount = l.EMIAmount,
                    TotalRepayment = l.TotalRepayment,
                    Status = l.Status.ToString(),
                    StartDate = l.StartDate,
                    CreatedAt = l.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var stats = new DashboardStatsDto
            {
                TotalLoans = await _context.Loans.CountAsync(),
                PendingLoans = await _context.Loans.CountAsync(l => l.Status == LoanStatus.Pending),
                ApprovedLoans = await _context.Loans.CountAsync(l => l.Status == LoanStatus.Approved),
                ActiveLoans = await _context.Loans.CountAsync(l => l.Status == LoanStatus.Active),
                TotalLoanAmount = await _context.Loans.SumAsync(l => l.PrincipalAmount),
                TotalPaidAmount = 0,
                TotalPendingAmount = 0
            };

            return stats;
        }

        public decimal CalculateEMI(decimal principal, decimal annualRate, int months)
        {
            decimal monthlyRate = annualRate / 12 / 100;
            decimal emi = principal * monthlyRate * (decimal)Math.Pow(1 + (double)monthlyRate, months)
                         / (decimal)(Math.Pow(1 + (double)monthlyRate, months) - 1);
            return Math.Round(emi, 2);
        }
    }
}
using SmartLoan.API.DTOs;
using SmartLoan.Data.Models;

namespace SmartLoan.Services.Interfaces
{
    public interface ILoanService
    {
        Task<Loan> CreateLoanAsync(int userId, CreateLoanRequest request);
        Task<LoanStatusDto> CheckLoanStatusAsync(int userId, int loanId);
        Task<Loan> ApproveLoanAsync(int adminId, int loanId);
        Task<Loan> RejectLoanAsync(int adminId, int loanId, string reason);
        Task<List<LoanDto>> GetUserLoansAsync(int userId);
        Task<List<LoanDto>> GetAllLoansAsync();
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<List<LoanDto>> GetPendingLoansAsync();
        decimal CalculateEMI(decimal principal, decimal annualRate, int months);
    }
}
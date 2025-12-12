using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLoan.Services.Interfaces;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SmartLoan.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ILoanService _loanService;

        public AdminController(ILoanService loanService)
        {
            _loanService = loanService;
        }

        [HttpGet("loans")]
        public async Task<IActionResult> GetAllLoans()
        {
            var loans = await _loanService.GetAllLoansAsync();
            return Ok(loans);
        }

        [HttpGet("loans/pending")]
        public async Task<IActionResult> GetPendingLoans()
        {
            var loans = await _loanService.GetPendingLoansAsync();
            return Ok(loans);
        }

        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _loanService.GetDashboardStatsAsync();
            return Ok(stats);
        }

        [HttpPost("loans/{loanId}/approve")]
        public async Task<IActionResult> ApproveLoan(int loanId)
        {
            try
            {
                var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var loan = await _loanService.ApproveLoanAsync(adminId, loanId);
                return Ok(new { message = "Loan approved", loanId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("loans/{loanId}/reject")]
        public async Task<IActionResult> RejectLoan(int loanId, [FromBody] string reason)
        {
            try
            {
                var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var loan = await _loanService.RejectLoanAsync(adminId, loanId, reason);
                return Ok(new { message = "Loan rejected", loanId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
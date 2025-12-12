using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLoan.API.DTOs;
using SmartLoan.Services.Interfaces;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SmartLoan.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LoansController : ControllerBase
    {
        private readonly ILoanService _loanService;

        public LoansController(ILoanService loanService)
        {
            _loanService = loanService;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> CreateLoan([FromBody] CreateLoanRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var loan = await _loanService.CreateLoanAsync(userId, request);
                return Ok(new { message = "Loan application submitted", loanId = loan.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("status/{loanId}")]
        public async Task<IActionResult> CheckStatus(int loanId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var status = await _loanService.CheckLoanStatusAsync(userId, loanId);
                return Ok(status);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("my-loans")]
        public async Task<IActionResult> GetMyLoans()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var loans = await _loanService.GetUserLoansAsync(userId);
            return Ok(loans);
        }

        [HttpGet("calculate-emi")]
        [AllowAnonymous]
        public IActionResult CalculateEMI([FromQuery] decimal principal, [FromQuery] decimal rate, [FromQuery] int months)
        {
            try
            {
                var emi = _loanService.CalculateEMI(principal, rate, months);
                return Ok(new
                {
                    emi,
                    total = emi * months,
                    interest = (emi * months) - principal
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
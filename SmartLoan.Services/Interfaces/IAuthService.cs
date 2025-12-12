using System.Threading.Tasks;
using SmartLoan.API.DTOs;

namespace SmartLoan.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        string GenerateJwtToken(Data.Models.User user);
    }
}
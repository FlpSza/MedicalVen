using MedicalVEN.API.DTOs;

namespace MedicalVEN.API.Services;

public interface IAuthService
{
    Task<string> RegisterAsync(RegisterDto registerDto);
    Task<string?> LoginAsync(LoginDto loginDto);
    Task<UserDto?> GetUserByIdAsync(int id);
}

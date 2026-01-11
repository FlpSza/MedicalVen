using MedicalVEN.API.Models;

namespace MedicalVEN.API.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string? Specialization { get; set; }
    public string? LicenseNumber { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Location { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }
    public string FullName => $"{FirstName} {LastName}";
}

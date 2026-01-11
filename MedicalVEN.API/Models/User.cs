namespace MedicalVEN.API.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string? Specialization { get; set; }
    public string? LicenseNumber { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Location { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}

public enum UserRole
{
    Patient = 0,
    Doctor = 1,
    Admin = 2
}

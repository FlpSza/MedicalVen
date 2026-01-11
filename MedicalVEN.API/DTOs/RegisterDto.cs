using System.ComponentModel.DataAnnotations;
using MedicalVEN.API.Models;

namespace MedicalVEN.API.DTOs;

public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; }

    // Doctor-specific fields
    public string? Specialization { get; set; }
    public string? LicenseNumber { get; set; }

    // Optional fields
    public string? PhoneNumber { get; set; }
    public string? Location { get; set; }
    public string? Bio { get; set; }
}

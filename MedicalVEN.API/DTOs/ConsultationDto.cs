using MedicalVEN.API.Models;

namespace MedicalVEN.API.DTOs;

public class ConsultationDto
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public UserDto? Patient { get; set; }
    public UserDto? Doctor { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ConsultationStatus Status { get; set; }
    public DateTime ScheduledAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? Diagnosis { get; set; }
    public string? Prescription { get; set; }
    public string? Notes { get; set; }
}

public class CreateConsultationDto
{
    public int DoctorId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime ScheduledAt { get; set; }
}

public class UpdateConsultationDto
{
    public ConsultationStatus? Status { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public string? Diagnosis { get; set; }
    public string? Prescription { get; set; }
    public string? Notes { get; set; }
}

namespace MedicalVEN.API.Models;

public class Consultation
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public User Patient { get; set; } = null!;
    public User Doctor { get; set; } = null!;
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ConsultationStatus Status { get; set; } = ConsultationStatus.Pending;
    public DateTime ScheduledAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public string? Diagnosis { get; set; }
    public string? Prescription { get; set; }
    public string? Notes { get; set; }
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}

public enum ConsultationStatus
{
    Pending = 0,
    Scheduled = 1,
    InProgress = 2,
    Completed = 3,
    Cancelled = 4
}

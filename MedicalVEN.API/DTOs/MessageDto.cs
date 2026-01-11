namespace MedicalVEN.API.DTOs;

public class MessageDto
{
    public int Id { get; set; }
    public int ConsultationId { get; set; }
    public int SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public bool IsRead { get; set; }
}

public class CreateMessageDto
{
    public int ConsultationId { get; set; }
    public string Content { get; set; } = string.Empty;
}

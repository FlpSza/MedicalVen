using MedicalVEN.API.DTOs;

namespace MedicalVEN.API.Services;

public interface IMessageService
{
    Task<MessageDto> SendMessageAsync(CreateMessageDto createDto, int senderId);
    Task<IEnumerable<MessageDto>> GetMessagesByConsultationAsync(int consultationId, int userId);
    Task MarkMessageAsReadAsync(int messageId, int userId);
}

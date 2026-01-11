using MedicalVEN.API.Data;
using MedicalVEN.API.DTOs;
using MedicalVEN.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MedicalVEN.API.Services;

public class MessageService : IMessageService
{
    private readonly ApplicationDbContext _context;

    public MessageService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MessageDto> SendMessageAsync(CreateMessageDto createDto, int senderId)
    {
        // Verify consultation exists and user is part of it
        var consultation = await _context.Consultations
            .FirstOrDefaultAsync(c => c.Id == createDto.ConsultationId && (c.PatientId == senderId || c.DoctorId == senderId));

        if (consultation == null)
        {
            throw new UnauthorizedAccessException("Consulta não encontrada ou acesso negado.");
        }

        var message = new Message
        {
            ConsultationId = createDto.ConsultationId,
            SenderId = senderId,
            Content = createDto.Content
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        var sender = await _context.Users.FindAsync(senderId);
        return new MessageDto
        {
            Id = message.Id,
            ConsultationId = message.ConsultationId,
            SenderId = message.SenderId,
            SenderName = sender != null ? $"{sender.FirstName} {sender.LastName}" : "Usuário",
            Content = message.Content,
            SentAt = message.SentAt,
            IsRead = message.IsRead
        };
    }

    public async Task<IEnumerable<MessageDto>> GetMessagesByConsultationAsync(int consultationId, int userId)
    {
        // Verify user is part of consultation
        var consultation = await _context.Consultations
            .FirstOrDefaultAsync(c => c.Id == consultationId && (c.PatientId == userId || c.DoctorId == userId));

        if (consultation == null)
        {
            throw new UnauthorizedAccessException("Consulta não encontrada ou acesso negado.");
        }

        var messages = await _context.Messages
            .Include(m => m.Sender)
            .Where(m => m.ConsultationId == consultationId)
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        return messages.Select(m => new MessageDto
        {
            Id = m.Id,
            ConsultationId = m.ConsultationId,
            SenderId = m.SenderId,
            SenderName = m.Sender != null ? $"{m.Sender.FirstName} {m.Sender.LastName}" : "Usuário",
            Content = m.Content,
            SentAt = m.SentAt,
            IsRead = m.IsRead
        });
    }

    public async Task MarkMessageAsReadAsync(int messageId, int userId)
    {
        var message = await _context.Messages
            .Include(m => m.Consultation)
            .FirstOrDefaultAsync(m => m.Id == messageId);

        if (message == null)
        {
            throw new KeyNotFoundException("Mensagem não encontrada.");
        }

        // Only mark as read if user is not the sender
        if (message.SenderId != userId && 
            (message.Consultation.PatientId == userId || message.Consultation.DoctorId == userId))
        {
            message.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }
}

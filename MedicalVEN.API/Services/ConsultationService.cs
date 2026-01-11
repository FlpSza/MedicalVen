using MedicalVEN.API.Data;
using MedicalVEN.API.DTOs;
using MedicalVEN.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MedicalVEN.API.Services;

public class ConsultationService : IConsultationService
{
    private readonly ApplicationDbContext _context;

    public ConsultationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ConsultationDto> CreateConsultationAsync(CreateConsultationDto createDto, int patientId)
    {
        var consultation = new Consultation
        {
            PatientId = patientId,
            DoctorId = createDto.DoctorId,
            Subject = createDto.Subject,
            Description = createDto.Description,
            ScheduledAt = createDto.ScheduledAt,
            Status = ConsultationStatus.Pending
        };

        _context.Consultations.Add(consultation);
        await _context.SaveChangesAsync();

        return await GetConsultationByIdAsync(consultation.Id, patientId) ?? throw new InvalidOperationException("Erro ao criar consulta");
    }

    public async Task<IEnumerable<ConsultationDto>> GetConsultationsByUserAsync(int userId)
    {
        var consultations = await _context.Consultations
            .Include(c => c.Patient)
            .Include(c => c.Doctor)
            .Where(c => c.PatientId == userId || c.DoctorId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return consultations.Select(c => MapToDto(c));
    }

    public async Task<ConsultationDto?> GetConsultationByIdAsync(int id, int userId)
    {
        var consultation = await _context.Consultations
            .Include(c => c.Patient)
            .Include(c => c.Doctor)
            .FirstOrDefaultAsync(c => c.Id == id && (c.PatientId == userId || c.DoctorId == userId));

        if (consultation == null) return null;

        return MapToDto(consultation);
    }

    public async Task<ConsultationDto> UpdateConsultationAsync(int id, UpdateConsultationDto updateDto, int userId)
    {
        var consultation = await _context.Consultations
            .FirstOrDefaultAsync(c => c.Id == id && (c.PatientId == userId || c.DoctorId == userId));

        if (consultation == null)
        {
            throw new KeyNotFoundException("Consulta não encontrada.");
        }

        if (updateDto.Status.HasValue)
        {
            consultation.Status = updateDto.Status.Value;
            if (updateDto.Status.Value == ConsultationStatus.Completed)
            {
                consultation.CompletedAt = DateTime.UtcNow;
            }
        }

        if (updateDto.ScheduledAt.HasValue)
        {
            consultation.ScheduledAt = updateDto.ScheduledAt.Value;
        }

        if (updateDto.Diagnosis != null)
        {
            consultation.Diagnosis = updateDto.Diagnosis;
        }

        if (updateDto.Prescription != null)
        {
            consultation.Prescription = updateDto.Prescription;
        }

        if (updateDto.Notes != null)
        {
            consultation.Notes = updateDto.Notes;
        }

        await _context.SaveChangesAsync();

        return await GetConsultationByIdAsync(id, userId) ?? throw new InvalidOperationException("Erro ao atualizar consulta");
    }

    private ConsultationDto MapToDto(Consultation consultation)
    {
        return new ConsultationDto
        {
            Id = consultation.Id,
            PatientId = consultation.PatientId,
            DoctorId = consultation.DoctorId,
            Patient = consultation.Patient != null ? new UserDto
            {
                Id = consultation.Patient.Id,
                Email = consultation.Patient.Email,
                FirstName = consultation.Patient.FirstName,
                LastName = consultation.Patient.LastName,
                Role = consultation.Patient.Role
            } : null,
            Doctor = consultation.Doctor != null ? new UserDto
            {
                Id = consultation.Doctor.Id,
                Email = consultation.Doctor.Email,
                FirstName = consultation.Doctor.FirstName,
                LastName = consultation.Doctor.LastName,
                Role = consultation.Doctor.Role,
                Specialization = consultation.Doctor.Specialization
            } : null,
            Subject = consultation.Subject,
            Description = consultation.Description,
            Status = consultation.Status,
            ScheduledAt = consultation.ScheduledAt,
            CreatedAt = consultation.CreatedAt,
            CompletedAt = consultation.CompletedAt,
            Diagnosis = consultation.Diagnosis,
            Prescription = consultation.Prescription,
            Notes = consultation.Notes
        };
    }
}

using MedicalVEN.API.DTOs;

namespace MedicalVEN.API.Services;

public interface IConsultationService
{
    Task<ConsultationDto> CreateConsultationAsync(CreateConsultationDto createDto, int patientId);
    Task<IEnumerable<ConsultationDto>> GetConsultationsByUserAsync(int userId);
    Task<ConsultationDto?> GetConsultationByIdAsync(int id, int userId);
    Task<ConsultationDto> UpdateConsultationAsync(int id, UpdateConsultationDto updateDto, int userId);
}

using MedicalVEN.API.DTOs;
using MedicalVEN.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MedicalVEN.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConsultationsController : ControllerBase
{
    private readonly IConsultationService _consultationService;

    public ConsultationsController(IConsultationService consultationService)
    {
        _consultationService = consultationService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateConsultation([FromBody] CreateConsultationDto createDto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        try
        {
            var consultation = await _consultationService.CreateConsultationAsync(createDto, userId);
            return CreatedAtAction(nameof(GetConsultation), new { id = consultation.Id }, consultation);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetConsultations()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var consultations = await _consultationService.GetConsultationsByUserAsync(userId);
        return Ok(consultations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetConsultation(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var consultation = await _consultationService.GetConsultationByIdAsync(id, userId);
        if (consultation == null)
        {
            return NotFound();
        }
        return Ok(consultation);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateConsultation(int id, [FromBody] UpdateConsultationDto updateDto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        try
        {
            var consultation = await _consultationService.UpdateConsultationAsync(id, updateDto, userId);
            return Ok(consultation);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

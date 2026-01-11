using MedicalVEN.API.Data;
using MedicalVEN.API.DTOs;
using MedicalVEN.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MedicalVEN.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("doctors")]
    public async Task<IActionResult> GetDoctors()
    {
        var doctors = await _context.Users
            .Where(u => u.Role == UserRole.Doctor && u.IsActive)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Role,
                Specialization = u.Specialization,
                Location = u.Location,
                Bio = u.Bio,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();

        return Ok(doctors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            Specialization = user.Specialization,
            LicenseNumber = user.LicenseNumber,
            PhoneNumber = user.PhoneNumber,
            Location = user.Location,
            Bio = user.Bio,
            CreatedAt = user.CreatedAt
        };

        return Ok(userDto);
    }
}

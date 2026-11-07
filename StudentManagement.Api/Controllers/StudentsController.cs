using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Api.Data;
using StudentManagement.Api.Models;
using StudentManagement.Api.DTOs;

namespace StudentManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StudentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/students
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
    {
        var students = await _context.Students.ToListAsync();

        return Ok(students);
    }

    // GET: api/students/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Student>> GetStudent(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                Title = "Invalid student ID.",
                Detail = "Student ID cannot be empty or whitespace.",
                Instance = HttpContext.Request.Path
            });
        }

        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student == null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Type = "https://tools.ietf.org/html/rfc9110#section-15.5.5",
                Title = "Student not found.",
                Detail = $"Student with ID '{id}' was not found.",
                Instance = HttpContext.Request.Path
            });
        }

        return Ok(student);
    }

    // POST: api/students
    [HttpPost]
    public async Task<ActionResult<Student>> CreateStudent(
        CreateStudentDto studentDto)
    {
        var emailExists = await _context.Students
            .AnyAsync(s => s.Email == studentDto.Email);

        if (emailExists)
        {
            return Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Type = "https://tools.ietf.org/html/rfc9110#section-15.5.10",
                Title = "Email already registered.",
                Detail = $"A student with email '{studentDto.Email}' already exists.",
                Instance = HttpContext.Request.Path
            });
        }

        var student = new Student
        {
            FirstName = studentDto.FirstName,
            LastName = studentDto.LastName,
            Email = studentDto.Email,
            Phone = studentDto.Phone,
            DateOfBirth = studentDto.DateOfBirth,
            Gender = studentDto.Gender,
            Address = studentDto.Address,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow
        };

        _context.Students.Add(student);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetStudent),
            new { id = student.Id },
            student
        );
    }

    // PUT: api/students/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(
        string id,
        UpdateStudentDto dto)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                Title = "Invalid student ID.",
                Detail = "Student ID cannot be empty or whitespace.",
                Instance = HttpContext.Request.Path
            });
        }

        var student = await _context.Students.FindAsync(id);

        if (student == null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Type = "https://tools.ietf.org/html/rfc9110#section-15.5.5",
                Title = "Student not found.",
                Detail = $"Student with ID '{id}' was not found.",
                Instance = HttpContext.Request.Path
            });
        }

        var emailConflict = await _context.Students
            .AnyAsync(s => s.Email == dto.Email && s.Id != id);

        if (emailConflict)
        {
            return Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Type = "https://tools.ietf.org/html/rfc9110#section-15.5.10",
                Title = "Email already in use.",
                Detail = $"The email '{dto.Email}' is already in use by another student.",
                Instance = HttpContext.Request.Path
            });
        }

        student.FirstName = dto.FirstName;
        student.LastName = dto.LastName;
        student.Email = dto.Email;
        student.Phone = dto.Phone;
        student.DateOfBirth = dto.DateOfBirth;
        student.Gender = dto.Gender;
        student.Address = dto.Address;
        student.UpdatedAt = DateTimeOffset.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Students.AnyAsync(s => s.Id == id))
            {
                return NotFound(new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Type = "https://tools.ietf.org/html/rfc9110#section-15.5.5",
                    Title = "Student not found.",
                    Detail = $"Student with ID '{id}' was not found.",
                    Instance = HttpContext.Request.Path
                });
            }
            throw;
        }

        return Ok(student);
    }

    // DELETE: api/students/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                Title = "Invalid student ID.",
                Detail = "Student ID cannot be empty or whitespace.",
                Instance = HttpContext.Request.Path
            });
        }

        var student = await _context.Students.FindAsync(id);

        if (student == null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Type = "https://tools.ietf.org/html/rfc9110#section-15.5.5",
                Title = "Student not found.",
                Detail = $"Student with ID '{id}' was not found.",
                Instance = HttpContext.Request.Path
            });
        }

        _context.Students.Remove(student);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

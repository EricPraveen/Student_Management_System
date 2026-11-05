
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
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student == null)
        {
            return NotFound();
        }

        return Ok(student);
    }

    // POST: api/students
    [HttpPost]
    public async Task<ActionResult<Student>> CreateStudent(
        CreateStudentDto studentDto)
    {
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
        var student = await _context.Students.FindAsync(id);

        if (student == null)
        {
            return NotFound();
        }

        student.FirstName = dto.FirstName;
        student.LastName = dto.LastName;
        student.Email = dto.Email;
        student.Phone = dto.Phone;
        student.DateOfBirth = dto.DateOfBirth;
        student.Gender = dto.Gender;
        student.Address = dto.Address;

        student.UpdatedAt = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(student);
    }


    //Delete Method
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(string id)
    {
        var student = await _context.Students.FindAsync(id);

        if (student == null)
        {
            return NotFound();
        }

        _context.Students.Remove(student);

        await _context.SaveChangesAsync();

        return NoContent();
    }

}




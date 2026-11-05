
using System.ComponentModel.DataAnnotations;

namespace StudentManagement.Api.DTOs;

public class UpdateStudentDto
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Phone { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    [MaxLength(20)]
    public string? Gender { get; set; }

    public string? Address { get; set; }
}

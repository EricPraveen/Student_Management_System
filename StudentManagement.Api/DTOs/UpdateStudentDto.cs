using System.ComponentModel.DataAnnotations;
using StudentManagement.Api.Validation;

namespace StudentManagement.Api.DTOs;

public class UpdateStudentDto
{
    [Required(ErrorMessage = "First name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 100 characters.")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 100 characters.")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address format.")]
    [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters.")]
    public string Email { get; set; } = string.Empty;

    [RegularExpression(@"^\+?[0-9]{10,15}$", ErrorMessage = "Phone number must be between 10 and 15 digits (e.g., 0771234567 or +94771234567).")]
    public string? Phone { get; set; }

    [ValidDateOfBirth]
    public DateOnly? DateOfBirth { get; set; }

    [ValidGender]
    [StringLength(20, ErrorMessage = "Gender cannot exceed 20 characters.")]
    public string? Gender { get; set; }

    [StringLength(500, MinimumLength = 3, ErrorMessage = "Address must be between 3 and 500 characters.")]
    public string? Address { get; set; }
}

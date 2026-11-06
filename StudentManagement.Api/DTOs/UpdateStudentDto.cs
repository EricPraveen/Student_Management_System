using System.ComponentModel.DataAnnotations;
using StudentManagement.Api.Validation;

namespace StudentManagement.Api.DTOs;

public class UpdateStudentDto
{
    [Required(ErrorMessage = "First name is required.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 50 characters.")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 50 characters.")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
    [StringLength(254, MinimumLength = 5, ErrorMessage = "Email must be between 5 and 254 characters.")]
    public string Email { get; set; } = string.Empty;

    [StringLength(13, ErrorMessage = "Phone number cannot exceed 13 characters.")]
    [RegularExpression(
        @"^(?:\+94|0)?7[0-9]{8}$",
        ErrorMessage = "Please enter a valid Sri Lankan mobile number."
    )]
    public string? Phone { get; set; }

    [ValidDateOfBirth]
    public DateOnly? DateOfBirth { get; set; }

    [ValidGender]
    public string? Gender { get; set; }

    [ValidAddress]
    public string? Address { get; set; }
}

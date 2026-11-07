using System.ComponentModel.DataAnnotations;
using StudentManagement.Api.DTOs;
using Xunit;

namespace StudentManagement.Api.Tests;

public class StudentDtoValidationTests
{
    private static IList<ValidationResult> ValidateModel(object model)
    {
        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(model, null, null);
        Validator.TryValidateObject(model, validationContext, validationResults, validateAllProperties: true);
        return validationResults;
    }

    [Fact]
    public void CreateStudentDto_WithValidData_PassesValidation()
    {
        var dto = new CreateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Phone = "0771234567",
            DateOfBirth = new DateOnly(2000, 1, 15),
            Gender = "Male",
            Address = "123 Main Street, Colombo"
        };

        var errors = ValidateModel(dto);

        Assert.Empty(errors);
    }

    [Theory]
    [InlineData("", "Last", "valid@example.com", "First name is required.")]
    [InlineData("First", "", "valid@example.com", "Last name is required.")]
    [InlineData("First", "Last", "", "Email is required.")]
    public void CreateStudentDto_WithMissingRequiredFields_FailsValidation(
        string firstName, string lastName, string email, string expectedErrorMessage)
    {
        var dto = new CreateStudentDto
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == expectedErrorMessage);
    }

    [Theory]
    [InlineData("studentgmail.com")]
    [InlineData("student@")]
    [InlineData("@gmail.com")]
    [InlineData("student@@gmail.com")]
    public void CreateStudentDto_WithInvalidEmail_FailsValidation(string invalidEmail)
    {
        var dto = new CreateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = invalidEmail
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "Please enter a valid email address.");
    }

    [Theory]
    [InlineData("0771234567")]
    [InlineData("+94771234567")]
    [InlineData("771234567")]
    public void CreateStudentDto_WithValidSriLankanPhone_PassesValidation(string validPhone)
    {
        var dto = new CreateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Phone = validPhone
        };

        var errors = ValidateModel(dto);

        Assert.Empty(errors);
    }

    [Theory]
    [InlineData("07712345")]
    [InlineData("077123456789")]
    [InlineData("abcdefghij")]
    [InlineData("0111234567")]
    public void CreateStudentDto_WithInvalidPhone_FailsValidation(string invalidPhone)
    {
        var dto = new CreateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Phone = invalidPhone
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "Please enter a valid Sri Lankan mobile number.");
    }

    [Theory]
    [InlineData("A", "ValidLast", "First name must be between 2 and 50 characters.")]
    [InlineData("ValidFirst", "B", "Last name must be between 2 and 50 characters.")]
    public void CreateStudentDto_WithOutOfRangeNames_FailsValidation(
        string firstName, string lastName, string expectedErrorMessage)
    {
        var dto = new CreateStudentDto
        {
            FirstName = firstName,
            LastName = lastName,
            Email = "eric@example.com"
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == expectedErrorMessage);
    }

    [Fact]
    public void CreateStudentDto_WithFutureDateOfBirth_FailsValidation()
    {
        var dto = new CreateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            DateOfBirth = DateOnly.FromDateTime(DateTime.Today.AddDays(1))
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "Date of birth cannot be in the future.");
    }

    [Theory]
    [InlineData("Unknown")]
    [InlineData("Alien")]
    public void CreateStudentDto_WithInvalidGender_FailsValidation(string invalidGender)
    {
        var dto = new CreateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Gender = invalidGender
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage != null && e.ErrorMessage.Contains("Gender must be one of the following: Male, Female, Other."));
    }

    [Fact]
    public void UpdateStudentDto_WithValidData_PassesValidation()
    {
        var dto = new UpdateStudentDto
        {
            FirstName = "UpdatedFirst",
            LastName = "UpdatedLast",
            Email = "updated@example.com",
            Phone = "+94771234567",
            DateOfBirth = new DateOnly(2001, 5, 20),
            Gender = "Female",
            Address = "456 Galle Road, Colombo"
        };

        var errors = ValidateModel(dto);

        Assert.Empty(errors);
    }

    [Theory]
    [InlineData("", "Last", "valid@example.com", "First name is required.")]
    [InlineData("First", "", "valid@example.com", "Last name is required.")]
    [InlineData("First", "Last", "", "Email is required.")]
    public void UpdateStudentDto_WithMissingRequiredFields_FailsValidation(
        string firstName, string lastName, string email, string expectedErrorMessage)
    {
        var dto = new UpdateStudentDto
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == expectedErrorMessage);
    }

    [Theory]
    [InlineData("studentgmail.com")]
    [InlineData("student@")]
    [InlineData("@gmail.com")]
    [InlineData("student@@gmail.com")]
    public void UpdateStudentDto_WithInvalidEmail_FailsValidation(string invalidEmail)
    {
        var dto = new UpdateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = invalidEmail
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "Please enter a valid email address.");
    }

    [Theory]
    [InlineData("0771234567")]
    [InlineData("+94771234567")]
    [InlineData("771234567")]
    public void UpdateStudentDto_WithValidSriLankanPhone_PassesValidation(string validPhone)
    {
        var dto = new UpdateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Phone = validPhone
        };

        var errors = ValidateModel(dto);

        Assert.Empty(errors);
    }

    [Theory]
    [InlineData("07712345")]
    [InlineData("077123456789")]
    [InlineData("abcdefghij")]
    [InlineData("0111234567")]
    public void UpdateStudentDto_WithInvalidPhone_FailsValidation(string invalidPhone)
    {
        var dto = new UpdateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Phone = invalidPhone
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "Please enter a valid Sri Lankan mobile number.");
    }

    [Theory]
    [InlineData("A", "ValidLast", "First name must be between 2 and 50 characters.")]
    [InlineData("ValidFirst", "B", "Last name must be between 2 and 50 characters.")]
    public void UpdateStudentDto_WithOutOfRangeNames_FailsValidation(
        string firstName, string lastName, string expectedErrorMessage)
    {
        var dto = new UpdateStudentDto
        {
            FirstName = firstName,
            LastName = lastName,
            Email = "eric@example.com"
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == expectedErrorMessage);
    }

    [Fact]
    public void UpdateStudentDto_WithFutureDateOfBirth_FailsValidation()
    {
        var dto = new UpdateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            DateOfBirth = DateOnly.FromDateTime(DateTime.Today.AddDays(1))
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "Date of birth cannot be in the future.");
    }

    [Theory]
    [InlineData("Unknown")]
    [InlineData("Alien")]
    public void UpdateStudentDto_WithInvalidGender_FailsValidation(string invalidGender)
    {
        var dto = new UpdateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Gender = invalidGender
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage != null && e.ErrorMessage.Contains("Gender must be one of the following: Male, Female, Other."));
    }

    [Fact]
    public void UpdateStudentDto_WithMaxLengthAddress_PassesValidation()
    {
        var dto = new UpdateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Address = new string('A', 250)
        };

        var errors = ValidateModel(dto);

        Assert.Empty(errors);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("123 Main Street, Colombo")]
    [InlineData("Jaffna, Sri Lanka")]
    [InlineData("No. 25, Temple Road")]
    public void CreateStudentDto_WithValidAddress_PassesValidation(string? validAddress)
    {
        var dto = new CreateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Address = validAddress
        };

        var errors = ValidateModel(dto);

        Assert.Empty(errors);
    }

    [Fact]
    public void CreateStudentDto_WithMaxLengthAddress_PassesValidation()
    {
        var dto = new CreateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Address = new string('A', 250)
        };

        var errors = ValidateModel(dto);

        Assert.Empty(errors);
    }

    [Theory]
    [InlineData(" ")]
    [InlineData("   ")]
    [InlineData("\t")]
    [InlineData("     ")]
    public void CreateStudentDto_WithWhitespaceOnlyAddress_FailsValidation(string whitespaceAddress)
    {
        var dto = new CreateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Address = whitespaceAddress
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "Address cannot contain only whitespace.");
    }

    [Theory]
    [InlineData("A")]
    [InlineData("ABC")]
    [InlineData("1234")]
    [InlineData("  AB  ")]
    public void CreateStudentDto_WithTooShortAddress_FailsValidation(string shortAddress)
    {
        var dto = new CreateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Address = shortAddress
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "Address must be between 5 and 250 characters.");
    }

    [Fact]
    public void CreateStudentDto_WithTooLongAddress_FailsValidation()
    {
        var dto = new CreateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Address = new string('A', 251)
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "Address must be between 5 and 250 characters.");
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("123 Main Street, Colombo")]
    [InlineData("Jaffna, Sri Lanka")]
    [InlineData("No. 25, Temple Road")]
    public void UpdateStudentDto_WithValidAddress_PassesValidation(string? validAddress)
    {
        var dto = new UpdateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Address = validAddress
        };

        var errors = ValidateModel(dto);

        Assert.Empty(errors);
    }

    [Theory]
    [InlineData(" ")]
    [InlineData("   ")]
    [InlineData("\t")]
    [InlineData("     ")]
    public void UpdateStudentDto_WithWhitespaceOnlyAddress_FailsValidation(string whitespaceAddress)
    {
        var dto = new UpdateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Address = whitespaceAddress
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "Address cannot contain only whitespace.");
    }

    [Theory]
    [InlineData("A")]
    [InlineData("ABC")]
    [InlineData("1234")]
    [InlineData("  AB  ")]
    public void UpdateStudentDto_WithTooShortAddress_FailsValidation(string shortAddress)
    {
        var dto = new UpdateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Address = shortAddress
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "Address must be between 5 and 250 characters.");
    }

    [Fact]
    public void UpdateStudentDto_WithTooLongAddress_FailsValidation()
    {
        var dto = new UpdateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com",
            Address = new string('A', 251)
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "Address must be between 5 and 250 characters.");
    }
}

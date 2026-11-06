using System.ComponentModel.DataAnnotations;

namespace StudentManagement.Api.Validation;

public class ValidGenderAttribute : ValidationAttribute
{
    private static readonly string[] AllowedGenders = ["Male", "Female", "Other"];

    public override bool IsValid(object? value)
    {
        if (value is null)
        {
            return true;
        }

        var gender = value.ToString()?.Trim();
        if (string.IsNullOrEmpty(gender))
        {
            return true;
        }

        if (AllowedGenders.Any(g => string.Equals(g, gender, StringComparison.OrdinalIgnoreCase)))
        {
            return true;
        }

        ErrorMessage = $"Gender must be one of the following: {string.Join(", ", AllowedGenders)}.";
        return false;
    }
}


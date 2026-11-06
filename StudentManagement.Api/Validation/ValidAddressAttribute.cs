using System.ComponentModel.DataAnnotations;

namespace StudentManagement.Api.Validation;

public class ValidAddressAttribute : ValidationAttribute
{
    public const int MinimumLength = 5;
    public const int MaximumLength = 250;

    public override bool IsValid(object? value)
    {
        if (value is null)
        {
            return true;
        }

        if (value is not string address)
        {
            ErrorMessage = "Invalid address format.";
            return false;
        }

        if (address.Length == 0)
        {
            return true;
        }

        if (string.IsNullOrWhiteSpace(address))
        {
            ErrorMessage = "Address cannot contain only whitespace.";
            return false;
        }

        var trimmed = address.Trim();
        if (trimmed.Length < MinimumLength || address.Length > MaximumLength)
        {
            ErrorMessage = $"Address must be between {MinimumLength} and {MaximumLength} characters.";
            return false;
        }

        return true;
    }
}


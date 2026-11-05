using System.ComponentModel.DataAnnotations;

namespace StudentManagement.Api.Validation;

public class ValidDateOfBirthAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        if (value is null)
        {
            return true;
        }

        if (value is DateOnly date)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            if (date > today)
            {
                ErrorMessage = "Date of birth cannot be in the future.";
                return false;
            }

            if (date < new DateOnly(1900, 1, 1))
            {
                ErrorMessage = "Date of birth must be after 1900-01-01.";
                return false;
            }

            return true;
        }

        ErrorMessage = "Invalid date of birth format.";
        return false;
    }
}

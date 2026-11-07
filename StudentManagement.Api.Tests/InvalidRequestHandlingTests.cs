using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Routing;
using StudentManagement.Api.DTOs;
using Xunit;

namespace StudentManagement.Api.Tests;

public class InvalidRequestHandlingTests
{
    private static IList<ValidationResult> ValidateModel(object model)
    {
        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(model, null, null);
        Validator.TryValidateObject(model, validationContext, validationResults, validateAllProperties: true);
        return validationResults;
    }

    [Fact]
    public void CreateStudentDto_WithMultipleInvalidFields_FailsValidationWithAllErrors()
    {
        // Scenario from Section 1 of Invalid Request Handling guide:
        // firstName is "", lastName is "Prashanth", email is "invalid-email", phone is "abc123"
        var dto = new CreateStudentDto
        {
            FirstName = "",
            LastName = "Prashanth",
            Email = "invalid-email",
            Phone = "abc123"
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "First name is required.");
        Assert.Contains(errors, e => e.ErrorMessage == "Please enter a valid email address.");
        Assert.Contains(errors, e => e.ErrorMessage == "Please enter a valid Sri Lankan mobile number.");
    }

    [Fact]
    public void UpdateStudentDto_WithMultipleInvalidFields_FailsValidationWithAllErrors()
    {
        var dto = new UpdateStudentDto
        {
            FirstName = "",
            LastName = "",
            Email = "invalid-email",
            Phone = "invalid-phone"
        };

        var errors = ValidateModel(dto);

        Assert.Contains(errors, e => e.ErrorMessage == "First name is required.");
        Assert.Contains(errors, e => e.ErrorMessage == "Last name is required.");
        Assert.Contains(errors, e => e.ErrorMessage == "Please enter a valid email address.");
        Assert.Contains(errors, e => e.ErrorMessage == "Please enter a valid Sri Lankan mobile number.");
    }

    [Fact]
    public void ApiBehaviorOptions_InvalidModelStateResponseFactory_ReturnsValidationProblemDetails()
    {
        // Arrange
        var modelState = new ModelStateDictionary();
        modelState.AddModelError("FirstName", "First name is required.");
        modelState.AddModelError("Email", "Please enter a valid email address.");

        var httpContext = new DefaultHttpContext();
        httpContext.Request.Path = "/api/students";

        var actionContext = new ActionContext(
            httpContext,
            new RouteData(),
            new ActionDescriptor(),
            modelState
        );

        var apiBehaviorOptions = new ApiBehaviorOptions
        {
            InvalidModelStateResponseFactory = context =>
            {
                var problemDetails = new ValidationProblemDetails(context.ModelState)
                {
                    Type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                    Title = "One or more validation errors occurred.",
                    Status = StatusCodes.Status400BadRequest,
                    Instance = context.HttpContext.Request.Path
                };

                return new BadRequestObjectResult(problemDetails)
                {
                    ContentTypes = { "application/problem+json" }
                };
            }
        };

        // Act
        var result = apiBehaviorOptions.InvalidModelStateResponseFactory(actionContext) as BadRequestObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal(StatusCodes.Status400BadRequest, result.StatusCode);
        Assert.Contains("application/problem+json", result.ContentTypes);

        var problemDetails = Assert.IsType<ValidationProblemDetails>(result.Value);
        Assert.Equal("https://tools.ietf.org/html/rfc9110#section-15.5.1", problemDetails.Type);
        Assert.Equal("One or more validation errors occurred.", problemDetails.Title);
        Assert.Equal(StatusCodes.Status400BadRequest, problemDetails.Status);
        Assert.Equal("/api/students", problemDetails.Instance);
        Assert.True(problemDetails.Errors.ContainsKey("FirstName"));
        Assert.True(problemDetails.Errors.ContainsKey("Email"));
    }
}

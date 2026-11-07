using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Api.Controllers;
using StudentManagement.Api.DTOs;
using Xunit;

namespace StudentManagement.Api.Tests;

public class StudentsControllerErrorHandlingTests
{
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task GetStudent_WithInvalidId_ReturnsBadRequestProblemDetails(string? invalidId)
    {
        var controller = new StudentsController(null!)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };

        var result = await controller.GetStudent(invalidId!);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
        var problemDetails = Assert.IsType<ProblemDetails>(badRequest.Value);
        Assert.Equal(StatusCodes.Status400BadRequest, problemDetails.Status);
        Assert.Equal("Invalid student ID.", problemDetails.Title);
        Assert.Equal("Student ID cannot be empty or whitespace.", problemDetails.Detail);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task UpdateStudent_WithInvalidId_ReturnsBadRequestProblemDetails(string? invalidId)
    {
        var controller = new StudentsController(null!)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };

        var dto = new UpdateStudentDto
        {
            FirstName = "Eric",
            LastName = "Praveen",
            Email = "eric@example.com"
        };

        var result = await controller.UpdateStudent(invalidId!, dto);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        var problemDetails = Assert.IsType<ProblemDetails>(badRequest.Value);
        Assert.Equal(StatusCodes.Status400BadRequest, problemDetails.Status);
        Assert.Equal("Invalid student ID.", problemDetails.Title);
        Assert.Equal("Student ID cannot be empty or whitespace.", problemDetails.Detail);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task DeleteStudent_WithInvalidId_ReturnsBadRequestProblemDetails(string? invalidId)
    {
        var controller = new StudentsController(null!)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };

        var result = await controller.DeleteStudent(invalidId!);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        var problemDetails = Assert.IsType<ProblemDetails>(badRequest.Value);
        Assert.Equal(StatusCodes.Status400BadRequest, problemDetails.Status);
        Assert.Equal("Invalid student ID.", problemDetails.Title);
        Assert.Equal("Student ID cannot be empty or whitespace.", problemDetails.Detail);
    }
}

using System.IO;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using StudentManagement.Api.Middleware;
using Xunit;

namespace StudentManagement.Api.Tests;

public class GlobalExceptionHandlerTests
{
    private class DummyLogger : ILogger<GlobalExceptionHandler>
    {
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel logLevel) => true;
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) { }
    }

    [Fact]
    public async Task TryHandleAsync_CapturesException_AndReturns500ProblemDetails()
    {
        // Arrange
        var handler = new GlobalExceptionHandler(new DummyLogger());
        var httpContext = new DefaultHttpContext();
        var responseStream = new MemoryStream();
        httpContext.Response.Body = responseStream;
        httpContext.Request.Path = "/api/students";

        var exception = new InvalidOperationException("Something went wrong");

        // Act
        var handled = await handler.TryHandleAsync(httpContext, exception, CancellationToken.None);

        // Assert
        Assert.True(handled);
        Assert.Equal(StatusCodes.Status500InternalServerError, httpContext.Response.StatusCode);
        Assert.Equal("application/problem+json", httpContext.Response.ContentType);

        responseStream.Seek(0, SeekOrigin.Begin);
        var problemDetails = await JsonSerializer.DeserializeAsync<ProblemDetails>(responseStream);

        Assert.NotNull(problemDetails);
        Assert.Equal(StatusCodes.Status500InternalServerError, problemDetails.Status);
        Assert.Equal("An error occurred while processing your request.", problemDetails.Title);
        Assert.Equal("An unexpected internal server error occurred. Please try again later.", problemDetails.Detail);
        Assert.Equal("/api/students", problemDetails.Instance);
    }
}

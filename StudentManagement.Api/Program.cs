using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Api.Data;
using StudentManagement.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Register CORS for Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
              {
                  if (Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                  {
                      return uri.Host == "localhost" || uri.Host == "127.0.0.1";
                  }
                  return false;
              })
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Register controllers with automatic model validation error response (400 Bad Request)
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
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
        };
    });

// Register Problem Details and Global Exception Handling (500 Internal Server Error)
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

// Register PostgreSQL database connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

// Configure HTTP request pipeline
app.UseExceptionHandler();

app.UseCors("AllowAngularDev");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();

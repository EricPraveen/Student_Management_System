using Microsoft.EntityFrameworkCore;
using StudentManagement.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Register controllers
builder.Services.AddControllers();

// Register PostgreSQL database connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

// Configure HTTP request pipeline
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapGet("/db-test", async (ApplicationDbContext db) =>
{
    try
    {
        bool connected = await db.Database.CanConnectAsync();

        return connected
            ? Results.Ok("Supabase database connected successfully!")
            : Results.Problem("Database connection failed.");
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex);
        return Results.Problem("Database connection failed. Check terminal logs.");
    }
});

app.MapControllers();

app.Run(); 
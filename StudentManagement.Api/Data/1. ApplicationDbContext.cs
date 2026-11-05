
using Microsoft.EntityFrameworkCore;
using StudentManagement.Api.Models;

namespace StudentManagement.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Student> Students { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Student>()
            .Property(s => s.Id)
            .HasDefaultValueSql("generate_student_id()")
            .ValueGeneratedOnAdd();
    }
}

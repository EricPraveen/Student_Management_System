
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentManagement.Api.Models;

[Table("students", Schema = "public")]
public class Student
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", TypeName = "character varying(20)")]
    public string? Id { get; set; }

    [Column("first_name", TypeName = "character varying(100)")]
    public string? FirstName { get; set; }

    [Column("last_name", TypeName = "character varying(100)")]
    public string? LastName { get; set; }

    [Column("email", TypeName = "character varying(255)")]
    public string? Email { get; set; }

    [Column("phone", TypeName = "character varying(20)")]
    public string? Phone { get; set; }

    [Column("date_of_birth", TypeName = "date")]
    public DateOnly? DateOfBirth { get; set; }

    [Column("gender", TypeName = "character varying(20)")]
    public string? Gender { get; set; }

    [Column("address", TypeName = "text")]
    public string? Address { get; set; }

    [Column("created_at", TypeName = "timestamp with time zone")]
    public DateTimeOffset? CreatedAt { get; set; }

    [Column("updated_at", TypeName = "timestamp with time zone")]
    public DateTimeOffset? UpdatedAt { get; set; }
}

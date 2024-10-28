using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Department
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(15)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public ICollection<Document> Documents { get; set; } = new List<Document>();
    public ICollection<User> Users { get; set; } = new List<User>();
}
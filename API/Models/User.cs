using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using API.Models;

public class User : IdentityUser
{
    [Required]
    public string FirstName { get; set; }

    [Required]
    public string MiddleName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public DateTime DateOfBirth { get; set; }
    
    public Guid? DepartmentId { get; set; }

    public Department? Department { get; set; }
    
    public ICollection<DocumentToUser> Documents { get; set; } = new List<DocumentToUser>();
}
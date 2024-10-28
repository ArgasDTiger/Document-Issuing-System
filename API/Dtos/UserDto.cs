using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class UserDto
{
    public string Login { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; } 
    public string LastName { get; set; }
    [EmailAddress]
    public string Email { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Token { get; set; }
    public ICollection<DocumentStatusDto> Documents { get; set; }
    public ICollection<string> Roles { get; set; }
}
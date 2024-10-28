using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class UserDto
{
    public Guid Id { get; set; }
    public string Login { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; } 
    public string LastName { get; set; }
    [EmailAddress]
    public string Email { get; set; }
    public DateTime DateOfBirth { get; set; }
    public DepartmentDto Department { get; set; }
    public string Token { get; set; }
    public ICollection<DocumentStatusDto> Documents { get; set; }
    public string Role { get; set; }
}
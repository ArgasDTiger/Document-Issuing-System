using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class AddUserDto
{
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public string Login { get; set; }
    
    [EmailAddress]
    public string Email { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Password { get; set; }
}
using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class AddDepartmentDto
{
    public string Name { get; set; } = string.Empty;
    [MaxLength(15)]
    public string PhoneNumber { get; set; } = string.Empty;
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
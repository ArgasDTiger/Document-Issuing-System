using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class ValidateResetTokenDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Token { get; set; }
}

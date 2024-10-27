using System.Text;
using System.Web;
using API.Dtos;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PasswordResetController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public PasswordResetController(
        UserManager<User> userManager,
        IEmailService emailService,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _emailService = emailService;
        _configuration = configuration;
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return Ok(new { Message = "If the email is already registered, you will receive a password reset link." });
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
        
        var frontendUrl = _configuration["FrontendUrl"];
        var resetLink = $"{frontendUrl}/reset-password?email={HttpUtility.UrlEncode(user.Email)}&token={encodedToken}";

        var emailSubject = "Password Reset Request";
        var emailBody = $@"
            Вітаю {user.FirstName} {user.MiddleName},<br><br>
            Ми отримали запит на зміну паролю для вашого облікового запису.<br>
            Щоб змінити пароль, будь ласка, натисніть на посилання нижче:<br><br>
            <a href='{resetLink}'>Змінити пароль</a><br><br>
            Якщо ви не запитували зміну паролю, проігноруйте цей лист.<br>
            Посилання дійсне протягом 24 годин.<br><br>
        ";

        await _emailService.SendEmailAsync(user.Email, emailSubject, emailBody);

        return Ok(new { Message = "If the email exists in our system, you will receive a password reset link." });
    }

    [HttpPost("validate-reset-token")]
    public async Task<IActionResult> ValidateResetToken([FromBody] ValidateResetTokenDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return BadRequest(new { Message = "Invalid token." });
        }

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));
        
        var isValid = await _userManager.VerifyUserTokenAsync(
            user,
            _userManager.Options.Tokens.PasswordResetTokenProvider,
            UserManager<User>.ResetPasswordTokenPurpose,
            decodedToken);

        if (!isValid)
        {
            return BadRequest(new { Message = "Invalid or expired token." });
        }

        return Ok(new { Message = "Token is valid." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return BadRequest(new { Message = "Invalid request." });
        }

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));

        var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);
        
        if (result.Succeeded)
        {
            return Ok(new { Message = "Password has been reset successfully." });
        }

        return BadRequest(new { Errors = result.Errors });
    }
}
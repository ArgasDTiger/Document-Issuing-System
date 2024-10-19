using API.Dtos;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PasswordGenerator;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IEmailService _emailService;
    private readonly ICredentialsGeneratorService _credentialsGeneratorService;

    public UsersController(IUserService userService, IEmailService emailService, ICredentialsGeneratorService credentialsGeneratorService)
    {
        _userService = userService;
        _emailService = emailService;
        _credentialsGeneratorService = credentialsGeneratorService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult> GetAllUsers([FromQuery] string sortField, [FromQuery] string sortDirection, [FromQuery] string searchString)
    {
        var users = await _userService.GetAllUsers(sortField, sortDirection, searchString);
        return Ok(users);
    }
    
    // TODO move logic of creation password and login into service
    [HttpPost("add-user")]
    public async Task<ActionResult> AddUser(AddUserDto addUserDto)
    {
        var passwordGenerator = new Password(16).IncludeLowercase().IncludeUppercase().IncludeNumeric().IncludeSpecial();
        var generatedPassword = passwordGenerator.Next();

        var generatedLogin = await _credentialsGeneratorService.GenerateLogin(addUserDto.FirstName, addUserDto.LastName);

        addUserDto.Password = generatedPassword;
        addUserDto.Login = generatedLogin;

        var result = await _userService.AddUser(addUserDto);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        var emailSubject = "Your Account Information";
        var emailBody = $"Вітаю, {addUserDto.FirstName} {addUserDto.MiddleName},<br/><br/>" +
                        $"Ваш акаунт для отримання документів був успішно створений.<br/>" +
                        $"Логін: {addUserDto.Login}<br/>" +
                        $"Пароль: {addUserDto.Password}<br/><br/>" +
                        $"Будь ласка, не повідомляйте ваші дані третім особам, і не забудьте одразу змінити пароль.<br/><br/>";

        await _emailService.SendEmailAsync(addUserDto.Email, emailSubject, emailBody);

        return Ok(new { Message = "User created successfully and email sent.", result.User });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("change-role")]
    public async Task<IActionResult> ChangeUserRole([FromQuery] string userId, [FromQuery] string newRole)
    {
        var result = await _userService.ChangeUserRole(userId, newRole);
        return result ? Ok(new { Message = "User role updated successfully" }) : BadRequest(new { Message = "Failed to update user role" });
    }
}
using API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly UserManager<User> _userManager;

    public AdminController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    [HttpPost("add-user")]
    public async Task<ActionResult> AddUser(AddUserDto addUserDto)
    {
        var existingUser = await _userManager.FindByNameAsync(addUserDto.Login);
        if (existingUser != null)
        {
            return BadRequest(new { Message = "Login is already taken." });
        }

        var user = new User
        {
            UserName = addUserDto.Login,
            FirstName = addUserDto.FirstName,
            MiddleName = addUserDto.MiddleName,
            LastName = addUserDto.LastName,
            DateOfBirth = addUserDto.DateOfBirth,
            Email = addUserDto.Email
        };

        var result = await _userManager.CreateAsync(user, addUserDto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await _userManager.AddToRoleAsync(user, "User");

        return Ok(new { Message = "User created successfully." });
    }
}
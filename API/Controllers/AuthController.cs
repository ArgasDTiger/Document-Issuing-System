using API.Dtos;
using API.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.Users
            .FirstOrDefaultAsync(x => x.UserName == loginDto.Login || x.Email == loginDto.Login);

        if (user == null)
        {
            return Unauthorized(new Response(401, "Invalid credentials"));
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (!result.Succeeded)
        {
            return Unauthorized(new Response(401, "Invalid credentials"));
        }
        
        return new UserDto
        {
            Login = user.UserName,
            FirstName = user.FirstName,
            MiddleName = user.MiddleName,
            LastName = user.LastName,
            DateOfBirth = user.DateOfBirth,
        };
    }
}
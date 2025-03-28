using API.Dtos;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
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
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IUserService userService, ITokenService tokenService, IMapper mapper)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _userService = userService;
        _tokenService = tokenService;
        _mapper = mapper;
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.Users
            .Include(u => u.Department)
            .FirstOrDefaultAsync(x => x.UserName == loginDto.UserLogin || x.Email == loginDto.UserLogin);

        if (user == null)
        {
            return Unauthorized(new Response(401, "Invalid credentials"));
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (!result.Succeeded)
        {
            return Unauthorized(new Response(401, "Invalid credentials"));
        }
    
        var token = await _tokenService.CreateToken(user);
    
        return new UserDto
        {
            Id = user.Id,
            Login = user.UserName,
            Email = user.Email,
            FirstName = user.FirstName,
            MiddleName = user.MiddleName,
            LastName = user.LastName,
            DateOfBirth = user.DateOfBirth,
            Department = _mapper.Map<DepartmentDto>(user.Department),
            Role = (await _userManager.GetRolesAsync(user))[0],
            Token = token
        };
    }
    
    [HttpGet("current")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        try
        {
            var userDto = await _userService.GetCurrentUserAsync(HttpContext.User);
            return Ok(userDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }
}
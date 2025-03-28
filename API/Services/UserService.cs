using System.Security.Claims;
using API.Dtos;
using API.Helpers;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IMapper _mapper;
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;

    public UserService(
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
        IMapper mapper,
        IUserRepository userRepository,
        ITokenService tokenService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
        _userRepository = userRepository;
        _tokenService = tokenService;
    }
    
    public async Task<PaginatedResponse<UserDto>> GetAllUsers(
        PaginationParameters pagination,
        string sortField = null,
        string sortDirection = "asc",
        string searchString = null)
    {
        var (users, totalCount) = await _userRepository.GetAllUsers(
            pagination, sortField, sortDirection, searchString);

        var userDtos = new List<UserDto>();
        foreach (var user in users)
        {
            var userDto = _mapper.Map<UserDto>(user);
            var roles = await _userManager.GetRolesAsync(user);
            userDto.Role = roles.FirstOrDefault() ?? "User";
        
            if (userDto.Role != "Admin")
            {
                userDtos.Add(userDto);
            }
        }

        return new PaginatedResponse<UserDto>(
            userDtos, 
            totalCount, 
            pagination.PageNumber, 
            pagination.PageSize);
    }


    public async Task<(bool Succeeded, IEnumerable<IdentityError> Errors, UserDto User)> AddUser(AddUserDto addUserDto)
    {
        var existingUserByEmail = await _userManager.FindByEmailAsync(addUserDto.Email);
        var existingUserByLogin = await _userManager.FindByNameAsync(addUserDto.Login);

        if (existingUserByEmail != null || existingUserByLogin != null)
        {
            return (false, new[] { new IdentityError { Description = "Email is already taken." } }, null);
        }

        var user = _mapper.Map<User>(addUserDto);
        var result = await _userManager.CreateAsync(user, addUserDto.Password);
        await _userManager.AddToRoleAsync(user, "User");
        if (!result.Succeeded)
        {
            return (false, result.Errors, null);
        }

        var userDto = _mapper.Map<UserDto>(user);
        return (true, Array.Empty<IdentityError>(), userDto);
    }

    public async Task<bool> ChangeUserRole(string userId, string newRole)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);

        if (!await _roleManager.RoleExistsAsync(newRole))
        {
            await _roleManager.CreateAsync(new IdentityRole(newRole));
        }

        var result = await _userManager.AddToRoleAsync(user, newRole);
        return result.Succeeded;
    }

    public async Task<UserDto> GetCurrentUserAsync(ClaimsPrincipal user)
    {
        var email = user.FindFirstValue(ClaimTypes.Email);
        var appUser = await _userManager.Users
            .Include(u => u.Department)
            .SingleOrDefaultAsync(x => x.Email == email);

        if (appUser == null)
        {
            throw new InvalidOperationException("User was not found.");
        }

        var userDto = _mapper.Map<UserDto>(appUser);
        userDto.Token = await _tokenService.CreateToken(appUser);
        userDto.Role = (await _userManager.GetRolesAsync(appUser))[0];
        userDto.Department = _mapper.Map<DepartmentDto>(appUser.Department);


        return userDto;
    }
}
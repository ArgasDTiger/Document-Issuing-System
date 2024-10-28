using System.Security.Claims;
using API.Dtos;
using API.Helpers;
using Microsoft.AspNetCore.Identity;

namespace API.Interfaces;

public interface IUserService
{
    Task<PaginatedResponse<UserDto>> GetAllUsers(PaginationParameters pagination, string sortField = null, string sortDirection = "asc", string searchString = null);
    Task<(bool Succeeded, IEnumerable<IdentityError> Errors, UserDto User)> AddUser(AddUserDto addUserDto);
    Task<bool> ChangeUserRole(string userId, string newRole);
    Task<UserDto> GetCurrentUserAsync(ClaimsPrincipal user);
}
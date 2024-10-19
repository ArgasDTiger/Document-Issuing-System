using API.Dtos;
using Microsoft.AspNetCore.Identity;

namespace API.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsers(string sortField = null, string sortDirection = "asc", string searchString = null);
    Task<(bool Succeeded, IEnumerable<IdentityError> Errors, UserDto User)> AddUser(AddUserDto addUserDto);
    Task<bool> ChangeUserRole(string userId, string newRole);
    Task<bool> RequestDocument(string login, Guid documentId);
    Task<bool> CompleteDocument(string login, Guid documentId);
    Task<bool> DeleteDocument(string login, Guid documentId);
}

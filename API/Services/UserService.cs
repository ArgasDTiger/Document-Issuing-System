using API.Dtos;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace API.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IMapper _mapper;
    private readonly IUserRepository _userRepository;
    private readonly IDocumentRepository _documentRepository;

    public UserService(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, 
        IMapper mapper, IUserRepository userRepository, IDocumentRepository documentRepository)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
        _userRepository = userRepository;
        _documentRepository = documentRepository;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsers(string sortField = null, string sortDirection = "asc", string searchString = null)
    {
        var users = await _userRepository.GetAllUsers(sortField, sortDirection, searchString);
        return _mapper.Map<IEnumerable<UserDto>>(users);
    }

    public async Task<(bool Succeeded, IEnumerable<IdentityError> Errors, UserDto User)> AddUser(AddUserDto addUserDto)
    {
        var existingUser = await _userManager.FindByNameAsync(addUserDto.Login);
        if (existingUser != null)
        {
            return (false, new[] { new IdentityError { Description = "Login is already taken." } }, null);
        }

        var user = _mapper.Map<User>(addUserDto);
        var result = await _userManager.CreateAsync(user, addUserDto.Password);

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

    public async Task<bool> RequestDocument(string login, Guid documentId)
    {
        var user = await _userManager.FindByNameAsync(login);
        if (user == null) return false;

        var existingDocument = await _documentRepository.GetDocumentById(documentId);
        if (existingDocument == null) return false; // Document doesn't exist in predefined list

        var documentToUser = await _userRepository.GetDocumentToUser(user.Id, documentId);
        if (documentToUser != null) return false; // Document already requested

        var newDocumentToUser = new DocumentToUser
        {
            UserId = user.Id,
            DocumentId = existingDocument.Id,
            RequestDate = DateTime.UtcNow
        };

        await _userRepository.AddDocumentToUser(newDocumentToUser);
        return await _userRepository.SaveAllAsync();
    }

    public async Task<bool> CompleteDocument(string login, Guid documentId)
    {
        var user = await _userManager.FindByNameAsync(login);
        if (user == null) return false;

        var documentToUser = await _userRepository.GetDocumentToUser(user.Id, documentId);
        
        if (documentToUser == null || documentToUser.ReceivedDate != null) return false;

        documentToUser.ReceivedDate = DateTime.UtcNow;
        await _userRepository.UpdateDocumentToUser(documentToUser);
        return await _userRepository.SaveAllAsync();
    }
    
    public async Task<bool> DeleteDocument(string login, Guid documentId)
    {
        var user = await _userManager.FindByNameAsync(login);
        if (user == null) return false;

        var documentToUser = await _userRepository.GetDocumentToUser(user.Id, documentId);
        if (documentToUser == null) return false;

        _userRepository.RemoveDocumentToUser(documentToUser);
        return await _userRepository.SaveAllAsync();
    }
}
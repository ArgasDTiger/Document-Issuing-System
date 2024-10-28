using API.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace API.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IUserRepository _userRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly UserManager<User> _userManager;

    public DepartmentService(IUserRepository userRepository, IDepartmentRepository departmentRepository, UserManager<User> userManager)
    {
        _userRepository = userRepository;
        _departmentRepository = departmentRepository;
        _userManager = userManager;
    }

    public async Task<bool> ChangeDepartment(string userId, Guid? departmentId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
            return false;
        
        var userRoles = await _userManager.GetRolesAsync(user);

        if (!userRoles.Contains("Employee"))
            return false;

        if (departmentId.HasValue)
        {
            var department = await _departmentRepository.GetByIdAsync(departmentId.Value);
            if (department == null)
                return false;

            user.DepartmentId = departmentId;
            user.Department = department;
        }
        else
        {
            user.DepartmentId = null;
            user.Department = null;
        }

        try
        {
            _userRepository.Update(user);
            await _userRepository.SaveAllAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }
}
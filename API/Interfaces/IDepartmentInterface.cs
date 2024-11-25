using API.Dtos;

namespace API.Interfaces;

public interface IDepartmentService
{
    Task<bool> ChangeDepartment(string userId, Guid? departmentId);
    Task<bool> AddDepartment(AddDepartmentDto addDepartmentDto);
}
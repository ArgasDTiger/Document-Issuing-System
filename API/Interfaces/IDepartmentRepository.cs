using API.Models;

namespace API.Interfaces;

public interface IDepartmentRepository : IBaseRepository<Department>
{
    Task<IEnumerable<Department>> GetDepartmentsWithDocumentsAsync();
    Task<Department?> GetDepartmentWithDocumentsAsync(Guid id);
}
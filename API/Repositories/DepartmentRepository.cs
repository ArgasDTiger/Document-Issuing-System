using API.Data;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class DepartmentRepository : BaseRepository<Department>, IDepartmentRepository
{
    private readonly DocumentDbContext _context;

    public DepartmentRepository(DocumentDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Department>> GetDepartmentsWithDocumentsAsync()
    {
        return await _context.Departments
            .Include(d => d.Documents)
            .ToListAsync();
    }

    public async Task<Department?> GetDepartmentWithDocumentsAsync(Guid id)
    {
        return await _context.Departments
            .Include(d => d.Documents)
            .FirstOrDefaultAsync(d => d.Id == id);
    }
}
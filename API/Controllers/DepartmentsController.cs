using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentRepository _departmentRepository;

    public DepartmentsController(IDepartmentRepository departmentRepository)
    {
        _departmentRepository = departmentRepository;
    }

    [HttpGet]
    public async Task<ActionResult> GetDepartments()
    {
        var departments = await _departmentRepository.GetDepartmentsWithDocumentsAsync();
        return Ok(departments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetDepartment(Guid id)
    {
        var department = await _departmentRepository.GetDepartmentWithDocumentsAsync(id);
        
        if (department == null)
            return NotFound();
            
        return Ok(department);
    }
}
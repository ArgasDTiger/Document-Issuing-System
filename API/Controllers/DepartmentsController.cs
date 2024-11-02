using API.Dtos;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IDepartmentService _departmentService;

    public DepartmentsController(IDepartmentRepository departmentRepository, IDepartmentService departmentService)
    {
        _departmentRepository = departmentRepository;
        _departmentService = departmentService;
    }

    [HttpGet]
    public async Task<ActionResult> GetDepartments()
    {
        var departments = await _departmentRepository.GetDepartmentsWithDocumentsAsync();
        return Ok(departments);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult> GetDepartment(Guid id)
    {
        var department = await _departmentRepository.GetDepartmentWithDocumentsAsync(id);
        
        if (department == null)
            return NotFound();
            
        return Ok(department);
    }
    
    [Authorize(Roles = "Admin")]
    [HttpPost("change-department")]
    public async Task<IActionResult> ChangeDepartment([FromBody] ChangeDepartmentDto changeDepartmentDto)
    {
        var result = await _departmentService.ChangeDepartment(changeDepartmentDto.UserId, changeDepartmentDto.DepartmentId);

        return result
            ? Ok(new { Message = "User department updated successfully" })
            : BadRequest(new { Message = "Failed to update user department" });
    }

}
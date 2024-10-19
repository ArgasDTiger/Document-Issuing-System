using API.Dtos;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult> GetAllUsers([FromQuery] string sortField, [FromQuery] string sortDirection, [FromQuery] string searchString)
    {
        var users = await _userService.GetAllUsers(sortField, sortDirection, searchString);
        return Ok(users);
    }
    
    [HttpPost("add-user")]
    public async Task<ActionResult> AddUser(AddUserDto addUserDto)
    {
        var result = await _userService.AddUser(addUserDto);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        return Ok(new { Message = "User created successfully.", User = result.User });
    }
    
    [Authorize(Roles = "Admin")]
    [HttpPost("change-role")]
    public async Task<IActionResult> ChangeUserRole([FromQuery] string userId, [FromQuery] string newRole)
    {
        var result = await _userService.ChangeUserRole(userId, newRole);
        return result ? Ok(new { Message = "User role updated successfully" }) : BadRequest(new { Message = "Failed to update user role" });
    }
    
    [HttpPost("request-document")]
    public async Task<ActionResult> RequestDocument([FromBody] DocumentRequestDto requestDto)
    {
        var result = await _userService.RequestDocument(requestDto.Login, requestDto.DocumentId);
        return result ? Ok(new { Message = "Document request processed successfully" }) : BadRequest(new { Message = "Failed to process document request" });
    }

    [HttpDelete("delete-document")]
    public async Task<ActionResult> DeleteDocument([FromBody] DocumentRequestDto requestDto)
    {
        var result = await _userService.DeleteDocument(requestDto.Login, requestDto.DocumentId);
        return result ? Ok(new { Message = "Document deleted successfully" }) : BadRequest(new { Message = "Failed to delete document" });
    }
    
    [HttpPost("complete-document")]
    public async Task<ActionResult> CompleteDocument([FromBody] DocumentCompleteDto completeDto)
    {
        var result = await _userService.CompleteDocument(completeDto.Login, completeDto.DocumentId);
        return result ? Ok(new { Message = "Document completed successfully" }) : BadRequest(new { Message = "Failed to complete document" });
    }
}
using API.Dtos;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IUserService _userService;

    public DocumentsController(IDocumentRepository documentRepository, IUserService userService)
    {
        _documentRepository = documentRepository;
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult> GetDocuments()
    {
        return Ok(await _documentRepository.GetAllDocuments());
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
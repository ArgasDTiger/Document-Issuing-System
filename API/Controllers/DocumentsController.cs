using System.Security.Claims;
using API.Dtos;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentRepository documentRepository, IDocumentService documentService)
    {
        _documentRepository = documentRepository;
        _documentService = documentService;
    }
    
    [Authorize]
    [HttpGet]
    public async Task<ActionResult> GetDocuments()
    {
        return Ok(await _documentRepository.GetAllAsync());
    }

    [Authorize]
    [HttpGet("my-documents")]
    public async Task<ActionResult<IEnumerable<DocumentStatusDto>>> GetUserDocuments()
    {
        var userLogin = User.FindFirst(JwtRegisteredClaimNames.Name)?.Value;

        if (string.IsNullOrEmpty(userLogin)) return Unauthorized();

        var documents = await _documentService.GetUserDocuments(userLogin);
        return Ok(documents);
    }

    [Authorize]
    [HttpGet("status/{documentId}")]
    public async Task<ActionResult<DocumentStatusDto>> GetDocumentStatus([FromBody] DocumentRequestDto requestDto)
    {
        var documentStatus = await _documentService.GetDocumentStatus(requestDto.UserLogin, requestDto.DocumentId);
        
        if (documentStatus == null) return NotFound(new { Message = "Document not found or you don't have access to it" });
        
        return Ok(documentStatus);
    }

    [Authorize]
    [HttpPost("request-document")]
    public async Task<ActionResult> RequestDocument([FromBody] DocumentRequestDto requestDto)
    {
        var result = await _documentService.RequestDocument(requestDto.UserLogin, requestDto.DocumentId);
        return result ? Ok(new { Message = "Document request processed successfully" }) 
            : BadRequest(new { Message = "Failed to process document request" });
    }
    
    [Authorize(Roles = "Admin")]
    [HttpDelete("delete-document/{documentId}")]
    public async Task<ActionResult> DeleteDocument([FromBody] DocumentRequestDto requestDto)
    {
        var result = await _documentService.DeleteDocument(requestDto.UserLogin, requestDto.DocumentId);
        return result ? Ok(new { Message = "Document deleted successfully" }) 
            : BadRequest(new { Message = "Failed to delete document" });
    }

    [Authorize(Roles = "Admin,Employee")]
    [HttpPost("complete-document")]
    public async Task<ActionResult> CompleteDocument([FromBody] DocumentRequestDto requestDto)
    {
        var result = await _documentService.CompleteDocument(requestDto.UserLogin, requestDto.DocumentId);
        return result ? Ok(new { Message = "Document completed successfully" }) 
            : BadRequest(new { Message = "Failed to complete document" });
    }
}
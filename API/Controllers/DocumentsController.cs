using API.Dtos;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

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

    [HttpGet]
    public async Task<ActionResult> GetDocuments()
    {
        return Ok(await _documentRepository.GetAllAsync());
    }

    [HttpPost("request-document")]
    public async Task<ActionResult> RequestDocument([FromBody] DocumentRequestDto requestDto)
    {
        var result = await _documentService.RequestDocument(requestDto.Login, requestDto.DocumentId);
        return result ? Ok(new { Message = "Document request processed successfully" }) : BadRequest(new { Message = "Failed to process document request" });
    }

    [HttpDelete("delete-document")]
    public async Task<ActionResult> DeleteDocument([FromBody] DocumentRequestDto requestDto)
    {
        var result = await _documentService.DeleteDocument(requestDto.Login, requestDto.DocumentId);
        return result ? Ok(new { Message = "Document deleted successfully" }) : BadRequest(new { Message = "Failed to delete document" });
    }

    [HttpPost("complete-document")]
    public async Task<ActionResult> CompleteDocument([FromBody] DocumentCompleteDto completeDto)
    {
        var result = await _documentService.CompleteDocument(completeDto.Login, completeDto.DocumentId);
        return result ? Ok(new { Message = "Document completed successfully" }) : BadRequest(new { Message = "Failed to complete document" });
    }
}
using API.Dtos;

namespace API.Interfaces;

public interface IDocumentService
{
    Task<bool> RequestDocument(string userLogin, Guid documentId);
    Task<bool> CompleteDocument(string userLogin, Guid documentId);
    Task<bool> DeleteDocument(string userLogin, Guid documentId);
    Task<DocumentStatusDto> GetDocumentStatus(string userLogin, Guid documentId);
    Task<IEnumerable<DocumentStatusDto>> GetUserDocuments(string userLogin);
}
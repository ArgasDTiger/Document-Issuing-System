using API.Models;

namespace API.Interfaces;

public interface IDocumentRepository
{
    Task<List<Document>> GetAllDocuments();
}
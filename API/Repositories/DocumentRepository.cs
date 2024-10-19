using API.Data;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

// TODO make correct abstraction with GenericRepo
public class DocumentRepository(DocumentDbContext context) : IDocumentRepository
{
    public async Task<List<Document>> GetAllDocuments()
    {
        return await context.Documents.ToListAsync();
    }
    
    public async Task<Document> GetDocumentById(Guid documentId)
    {
        return await context.Documents.FirstOrDefaultAsync(d => d.Id == documentId);
    }
}
using API.Data;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class DocumentRepository(DocumentDbContext context) : IDocumentRepository
{
    public async Task<List<Document>> GetAllDocuments()
    {
        return await context.Documents.ToListAsync();
    }
}
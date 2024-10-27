using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(DocumentDbContext context) : base(context) { }

    public async Task<IEnumerable<User>> GetAllUsers(string sortField = null, string sortDirection = "asc", string searchString = null)
    {
        var query = _context.Users
            .Include(u => u.Documents)
            .ThenInclude(d => d.Document)
            .ThenInclude(d => d.Department)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchString))
        {
            var search = searchString.ToLower();
            query = query.Where(u => 
                u.FirstName.ToLower().Contains(search) || 
                u.LastName.ToLower().Contains(search) || 
                u.Email.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(sortField))
        {
            query = sortField.ToLower() switch
            {
                "firstname" => sortDirection == "asc" 
                    ? query.OrderBy(u => u.FirstName) 
                    : query.OrderByDescending(u => u.FirstName),
                "lastname" => sortDirection == "asc" 
                    ? query.OrderBy(u => u.LastName) 
                    : query.OrderByDescending(u => u.LastName),
                "email" => sortDirection == "asc" 
                    ? query.OrderBy(u => u.Email) 
                    : query.OrderByDescending(u => u.Email),
                _ => query.OrderBy(u => u.FirstName)
            };
        }

        return await query.ToListAsync();
    }

    public async Task<User> GetUserByIdWithDocuments(string userId)
    {
        return await _dbSet
            .Include(u => u.Documents)
            .ThenInclude(d => d.Document)
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<DocumentToUser> GetDocumentToUser(string userId, Guid documentId)
    {
        return await _context.DocumentToUsers
            .Include(d => d.Document)
            .FirstOrDefaultAsync(d => d.UserId == userId && d.Document.Id == documentId);
    }

    public async Task AddDocumentToUser(DocumentToUser documentToUser)
    {
        await _context.DocumentToUsers.AddAsync(documentToUser);
    }

    public Task UpdateDocumentToUser(DocumentToUser documentToUser)
    {
        _context.DocumentToUsers.Update(documentToUser);
        return Task.CompletedTask;
    }
    
    public void RemoveDocumentToUser(DocumentToUser documentToUser)
    {
        _context.DocumentToUsers.Remove(documentToUser);
    }

    public async Task<IEnumerable<DocumentToUser>> GetUserDocuments(string userId)
    {
        return await _context.DocumentToUsers
            .Include(d => d.Document)
            .ThenInclude(doc => doc.Department)
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.RequestDate)
            .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
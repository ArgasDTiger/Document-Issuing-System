using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(DocumentDbContext context) : base(context) { }

    public async Task<IEnumerable<User>> GetAllUsers(string sortField = null, string sortDirection = "asc", string searchString = null)
    {
        var users = _dbSet.AsQueryable();

        if (!string.IsNullOrEmpty(searchString))
        {
            users = users.Where(u => 
                (u.FirstName + " " + u.LastName + " " + u.MiddleName).Contains(searchString));
        }

        if (!string.IsNullOrEmpty(sortField))
        {
            bool ascending = sortDirection?.ToLower() == "asc";
            users = ApplySorting(users, sortField, ascending);
        }

        return await users.ToListAsync();
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

}
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(DocumentDbContext context) : base(context) { }

    public async Task<(IEnumerable<User> users, int totalCount)> GetAllUsers(
        PaginationParameters pagination,
        string sortField = null,
        string sortDirection = "asc",
        string searchString = null)
    {
        var query = _context.Users
            .Include(u => u.Documents)
            .ThenInclude(d => d.Document)
            .ThenInclude(d => d.Department)
            .Include(u => u.Department) 
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchString))
        {
            Console.WriteLine($"search string is {searchString}");
            var searchTerms = searchString.ToLower().Split(" ", StringSplitOptions.RemoveEmptyEntries);

            query = query.AsEnumerable().Where(u =>
                searchTerms.All(term =>
                    u.FirstName.ToLower().Contains(term) ||
                    u.LastName.ToLower().Contains(term) ||
                    u.MiddleName.ToLower().Contains(term) ||
                    u.UserName.ToLower().Contains(term) ||
                    u.Email.ToLower().Contains(term))
            ).AsQueryable();
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

        var totalCount = query.Count();

        var users = query
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToList();
        
        Console.WriteLine("Found users:");
        foreach (var user in users)
        {
            Console.WriteLine($"{user.FirstName}");
        }
        return (users, totalCount);
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
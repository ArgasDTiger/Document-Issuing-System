using API.Helpers;
using API.Models;

namespace API.Interfaces;

public interface IUserRepository : IBaseRepository<User>
{
    Task<(IEnumerable<User> users, int totalCount)> GetAllUsers(PaginationParameters pagination, string sortField = null, string sortDirection = "asc", string searchString = null);
    Task<User> GetUserByIdWithDocuments(string userId);
    Task<DocumentToUser> GetDocumentToUser(string userId, Guid documentId);
    Task AddDocumentToUser(DocumentToUser documentToUser);
    Task UpdateDocumentToUser(DocumentToUser documentToUser);
    void RemoveDocumentToUser(DocumentToUser documentToUser);
    Task<IEnumerable<DocumentToUser>> GetUserDocuments(string userId);
    Task<bool> SaveAllAsync();
}
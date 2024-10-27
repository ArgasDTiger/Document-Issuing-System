using API.Interfaces;
using API.Models;

public interface IUserRepository : IBaseRepository<User>
{
    Task<IEnumerable<User>> GetAllUsers(string sortField = null, string sortDirection = "asc", string searchString = null);
    Task<User> GetUserByIdWithDocuments(string userId);
    Task<DocumentToUser> GetDocumentToUser(string userId, Guid documentId);
    Task AddDocumentToUser(DocumentToUser documentToUser);
    Task UpdateDocumentToUser(DocumentToUser documentToUser);
    void RemoveDocumentToUser(DocumentToUser documentToUser);
    Task<IEnumerable<DocumentToUser>> GetUserDocuments(string userId);
    Task<bool> SaveAllAsync();
}
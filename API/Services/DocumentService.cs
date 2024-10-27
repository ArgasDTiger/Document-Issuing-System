using API.Dtos;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Services;

public class DocumentService : IDocumentService
{
    private readonly UserManager<User> _userManager;
    private readonly IUserRepository _userRepository;
    private readonly IDocumentRepository _documentRepository;

    public DocumentService(
        UserManager<User> userManager,
        IUserRepository userRepository,
        IDocumentRepository documentRepository)
    {
        _userManager = userManager;
        _userRepository = userRepository;
        _documentRepository = documentRepository;
    }

    public async Task<DocumentStatusDto> GetDocumentStatus(string userLogin, Guid documentId)
    {
        var user = await _userManager.FindByNameAsync(userLogin);
        if (user == null) return null;

        var documentToUser = await _userRepository.GetDocumentToUser(user.Id, documentId);
        if (documentToUser == null) return null;

        return new DocumentStatusDto
        {
            DocumentId = documentToUser.DocumentId,
            DocumentName = documentToUser.Document.Name,
            DepartmentName = documentToUser.Document.Department.Name,
            RequestDate = documentToUser.RequestDate,
            ExpectedReceivingDate = documentToUser.ExpectedReceivingDate,
            ReceivedDate = documentToUser.ReceivedDate,
            Status = documentToUser.Status
        };
    }

    public async Task<IEnumerable<DocumentStatusDto>> GetUserDocuments(string userLogin)
    {
        var user = await _userManager.FindByNameAsync(userLogin);
        if (user == null) return new List<DocumentStatusDto>();

        var userDocuments = await _userRepository.GetUserDocuments(user.Id);
        
        return userDocuments.Select(doc => new DocumentStatusDto
        {
            DocumentId = doc.DocumentId,
            DocumentName = doc.Document.Name,
            DepartmentName = doc.Document.Department.Name,
            RequestDate = doc.RequestDate,
            ExpectedReceivingDate = doc.ExpectedReceivingDate,
            ReceivedDate = doc.ReceivedDate,
            Status = doc.Status
        }).ToList();
    }

    public async Task<bool> RequestDocument(string userLogin, Guid documentId)
    {
        var user = await _userManager.FindByNameAsync(userLogin);
        if (user == null) return false;

        var existingDocument = await _documentRepository.GetByIdAsync(documentId);
        if (existingDocument == null) return false;

        var documentToUser = await _userRepository.GetDocumentToUser(user.Id, documentId);
        if (documentToUser != null) return false;

        var newDocumentToUser = new DocumentToUser
        {
            UserId = user.Id,
            DocumentId = existingDocument.Id,
            RequestDate = DateTime.UtcNow
        };

        await _userRepository.AddDocumentToUser(newDocumentToUser);
        return await _userRepository.SaveAllAsync();
    }

    public async Task<bool> CompleteDocument(string userLogin, Guid documentId)
    {
        var user = await _userManager.FindByNameAsync(userLogin);
        if (user == null) return false;

        var documentToUser = await _userRepository.GetDocumentToUser(user.Id, documentId);
        if (documentToUser == null || documentToUser.ReceivedDate != null) return false;

        documentToUser.ReceivedDate = DateTime.UtcNow;
        await _userRepository.UpdateDocumentToUser(documentToUser);
        return await _userRepository.SaveAllAsync();
    }

    public async Task<bool> DeleteDocument(string userLogin, Guid documentId)
    {
        var user = await _userManager.FindByNameAsync(userLogin);
        if (user == null) return false;

        var documentToUser = await _userRepository.GetDocumentToUser(user.Id, documentId);
        if (documentToUser == null) return false;

        _userRepository.RemoveDocumentToUser(documentToUser);
        return await _userRepository.SaveAllAsync();
    }
}
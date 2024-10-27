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

    public async Task<bool> RequestDocument(string login, Guid documentId)
    {
        var user = await _userManager.FindByNameAsync(login);
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

    public async Task<bool> CompleteDocument(string login, Guid documentId)
    {
        var user = await _userManager.FindByNameAsync(login);
        if (user == null) return false;

        var documentToUser = await _userRepository.GetDocumentToUser(user.Id, documentId);
        if (documentToUser == null || documentToUser.ReceivedDate != null) return false;

        documentToUser.ReceivedDate = DateTime.UtcNow;
        await _userRepository.UpdateDocumentToUser(documentToUser);
        return await _userRepository.SaveAllAsync();
    }

    public async Task<bool> DeleteDocument(string login, Guid documentId)
    {
        var user = await _userManager.FindByNameAsync(login);
        if (user == null) return false;

        var documentToUser = await _userRepository.GetDocumentToUser(user.Id, documentId);
        if (documentToUser == null) return false;

        _userRepository.RemoveDocumentToUser(documentToUser);
        return await _userRepository.SaveAllAsync();
    }
}
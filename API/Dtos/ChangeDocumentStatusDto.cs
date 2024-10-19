namespace API.Dtos;

public class ChangeDocumentStatusDto
{
    public string UserId { get; set; }
    public string DocumentType { get; set; }
    public string Status { get; set; }
}
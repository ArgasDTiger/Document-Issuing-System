namespace API.Dtos;

public class DocumentToUserDto
{
    public string DocumentName { get; set; }
    public string Status { get; set; }
    public DateTime RequestDate { get; set; }
    public DateTime? ReceivedDate { get; set; }
}
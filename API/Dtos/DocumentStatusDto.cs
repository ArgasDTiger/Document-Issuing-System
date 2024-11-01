namespace API.Dtos;

public class DocumentStatusDto
{
    public Guid Id { get; set; }
    public string DocumentName { get; set; }
    public string DepartmentName { get; set; }
    public DateTime RequestDate { get; set; }
    public DateTime ExpectedReceivingDate { get; set; }
    public DateTime? ReceivedDate { get; set; }
    public string Status { get; set; }
}
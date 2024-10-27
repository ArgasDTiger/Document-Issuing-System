namespace API.Dtos;

public class DocumentDto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; }
    public Guid DepartmentId { get; set; }
}
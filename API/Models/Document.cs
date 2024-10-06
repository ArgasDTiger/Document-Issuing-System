using System.ComponentModel.DataAnnotations;

namespace Document_Issuing_System.Models;

public class Document
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Name { get; set; }

    [Required]
    public Guid HumanResourcesId { get; set; }

    public HumanResources HumanResources { get; set; }
}
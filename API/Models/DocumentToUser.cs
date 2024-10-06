using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class DocumentToUser
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; }
    
    public User User { get; set; }

    [Required]
    public Guid DocumentId { get; set; }
    
    public Document Document { get; set; }

    [Required]
    public DateTime RequestDate { get; set; }
    
    [NotMapped]
    public DateTime ExpectedReceivingDate => RequestDate.AddDays(7);

    public DateTime? ReceivedDate { get; set; }
}
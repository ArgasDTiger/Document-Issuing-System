using API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DocumentDbContext(DbContextOptions<DocumentDbContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<Document> Documents { get; set; }
    public DbSet<DocumentToUser> DocumentToUsers { get; set; }
    public DbSet<HumanResources> HumanResources { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Document>()
            .HasOne(d => d.HumanResources)
            .WithMany()
            .HasForeignKey(d => d.HumanResourcesId);

        modelBuilder.Entity<DocumentToUser>()
            .HasOne(d => d.User)
            .WithMany()
            .HasForeignKey(d => d.UserId);

        modelBuilder.Entity<DocumentToUser>()
            .HasOne(d => d.Document)
            .WithMany()
            .HasForeignKey(d => d.DocumentId);
        
        modelBuilder.Entity<User>()
            .HasOne(d => d.HumanResources)
            .WithMany()
            .HasForeignKey(d => d.HumanResourcesId);
    }
}

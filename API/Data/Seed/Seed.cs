using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Data.Seed;

public class Seed
{
    private static Guid? _locationIssuerId;
    private static Guid? _incomeIssuerId;
    
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<DocumentDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        await SeedRoles(roleManager);
        
        await SeedAdmin(userManager);

        await SeedDepartments(context);
        
        await SeedEmployees(userManager);
        
        await SeedDocuments(context);
    }
    
    private static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
    {
        string[] roleNames = { "Admin", "Employee", "User" };

        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }
    }

    private static async Task SeedAdmin(UserManager<User> userManager)
    {
        var adminUser = new User
        {
            UserName = "g_vasylenko",
            Email = "vasylenko.grygoriy48@gmail.com",
            FirstName = "Григорій",
            MiddleName = "Ігорович",
            LastName = "Василенко",
            DateOfBirth = new DateTime(1995, 11, 24)
        };

        var result = await userManager.CreateAsync(adminUser, "Admin000!");

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
    
    private static async Task SeedEmployees(UserManager<User> userManager)
    {
        var employees = new List<User>()
        {
            new User()
            {
                UserName = "m_petrenko",
                Email = "mykhailo.petrenko123@gmail.com",
                FirstName = "Михайло",
                MiddleName = "Сергійович",
                LastName = "Петренко",
                DateOfBirth = new DateTime(2002, 4, 5),
                DepartmentId = _locationIssuerId
            },
            new User()
            {
                UserName = "v_kravchuk",
                Email = "vasylyna.kravchuk777@gmail.com",
                FirstName = "Василина",
                MiddleName = "Петрівна",
                LastName = "Кравчук",
                DateOfBirth = new DateTime(2001, 7, 10),
                DepartmentId = _incomeIssuerId
            }
        };

        foreach (var employee in employees)
        {
            var result = await userManager.CreateAsync(employee, "Employee000!");

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(employee, "Employee");
            }
        }
        
    }
    
    private static async Task SeedDepartments(DocumentDbContext context)
    {
        var hrs = new List<Department>()
        {
            new Department()
            {
                Name = "Відділ видачі довідок про місце проживання",
                Email = "locationissuer@gmail.com",
                PhoneNumber = "0965685995"
            },
            new Department()
            {
                Name = "Відділ видачі довідок про доходи",
                Email = "incomeissuer@gmail.com",
                PhoneNumber = "0660562775"
            }
        };
        
        _locationIssuerId = hrs[0].Id;
        _incomeIssuerId = hrs[1].Id;

        await context.Departments.AddRangeAsync(hrs);
        await context.SaveChangesAsync();
    }
    
    private static async Task SeedDocuments(DocumentDbContext context)
    {
        var documents = new List<Document>()
        {
            new Document()
            {
                Name = "Довідка про місце проживання",
                DepartmentId = _locationIssuerId ?? Guid.Empty
            },
            new Document()
            {
                Name = "Довідка про доходи",
                DepartmentId = _incomeIssuerId ?? Guid.Empty
            }
        };

        await context.Documents.AddRangeAsync(documents);
        await context.SaveChangesAsync();
    }
}
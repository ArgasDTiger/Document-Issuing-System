using API.Data;
using Microsoft.AspNetCore.Identity;

namespace API.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection ConfigureIdentityServices(this IServiceCollection services)
    {
        services.AddIdentity<User, IdentityRole>(options => 
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 8;
            })
            .AddEntityFrameworkStores<DocumentDbContext>()
            .AddDefaultTokenProviders();

        return services;
    }
}
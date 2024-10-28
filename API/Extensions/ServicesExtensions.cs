using System.Text;
using System.Text.Json.Serialization;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class ServicesExtensions
{
    public static IServiceCollection ConfigureApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAutoMapper(typeof(MappingProfiles));
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            });
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddDbContext<DocumentDbContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("SQLiteConnection")));

        services.AddScoped<IDocumentRepository, DocumentRepository>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ICredentialsGeneratorService, CredentialsGeneratorService>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        services.AddScoped<IDocumentService, DocumentService>();
        services.AddScoped<IDepartmentService, DepartmentService>();

        return services;
    }

    public static IServiceCollection ConfigureJWT(this IServiceCollection services, IConfiguration configuration)
    {
        JWTOptions jwtOptions = new JWTOptions();
        configuration.Bind("JWT", jwtOptions);
        services.AddAuthentication(config =>
        {
            config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(config =>
        {
            config.RequireHttpsMetadata = false;
            config.SaveToken = true;
            config.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigninKey)),
                ValidIssuer = jwtOptions.Issuer,
                ValidateIssuer = false,
                ValidateAudience = false
            };
        });

        return services;
    }
}
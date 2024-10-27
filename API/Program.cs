using API.Data.Seed;
using API.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureIdentityServices();
builder.Services.ConfigureApplicationServices(builder.Configuration);
builder.Services.ConfigureJWT(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("CorsPolicy");

app.MapControllers();

// Uncomment when you need seeding
// using (var scope = app.Services.CreateScope())
// {
//     var services = scope.ServiceProvider;
//     await Seed.SeedAsync(services);
// }

app.Run();
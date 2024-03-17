using Microsoft.EntityFrameworkCore;
using backend_v2.Models;
using Serilog;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

// Configure Serilog
builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .WriteTo.Console());

if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
{
    // Add Entity Framework Core and Npgsql package from secrets.json if running locally
    builder.Services.AddDbContext<AlpinePeakDbContext>((serviceProvider, options) =>
    {
        IConfiguration configuration = serviceProvider.GetRequiredService<IConfiguration>();
        options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
    });
}
else
{
    // Add Entity Framework Core and Npgsql package AWS secrets store    
    builder.Services.AddDbContext<AlpinePeakDbContext>((serviceProvider, options) =>
    {
        options.UseNpgsql(Environment.GetEnvironmentVariable("POSTGRES_URL_SKI_ROCK_SHOP"));
    });
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseAuthorization();

app.MapControllers();

app.Run();

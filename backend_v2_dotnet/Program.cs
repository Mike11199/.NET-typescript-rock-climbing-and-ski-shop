using Microsoft.EntityFrameworkCore;
using backend_v2.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Serilog;
using Serilog.Events;


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

// get JWT symmetric key from secrets.json (not committed to git) if local or from docker env if in prod (aws task definition - AWS SSM)
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? "";
}

// add JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = new SymmetricSecurityKey
        (Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseAuthorization();

app.MapControllers();

app.Run();

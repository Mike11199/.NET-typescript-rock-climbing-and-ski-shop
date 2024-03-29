using backend_v2.DTOs;
using backend_v2.Models;
using backend_v2.Repositories;
using backend_v2.Utilities;
using Microsoft.EntityFrameworkCore;

public class UserRepository : IUserRepository
{
    private readonly AlpinePeakDbContext _dbContext;


    public UserRepository(AlpinePeakDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> GetUserByEmail(string email)
    {
        var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        return existingUser ?? null;
    }

    public async Task<User> RegisterNewUser(RegisterUserDto registerRequest)
    {
        var hashedPassword = BCryptUtils.HashPassword(registerRequest?.Password!);

        var newUser = new User
        {
            UserId = Guid.NewGuid(),
            Name = registerRequest?.Name,
            LastName = registerRequest?.LastName ?? null,
            Email = registerRequest?.Email,
            Password = hashedPassword,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await _dbContext.Users.AddAsync(newUser);
        await _dbContext.SaveChangesAsync();

        return newUser;

    }
}

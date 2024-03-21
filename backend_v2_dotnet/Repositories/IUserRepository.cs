using backend_v2.DTOs;
using backend_v2.Models;

namespace backend_v2.Repositories
{
    public interface IUserRepository
    {
        Task<User> RegisterNewUser(RegisterUserDto registerRequest);
        Task<User?> GetUserByEmail(string email);
    }
}

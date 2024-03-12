using backend_v2.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend_v2.Utilities
{
    public static class JWTUtilities
    {
        public static string GenerateToken(User user, IConfiguration configuration)
        {

            var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"] ?? "");

            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
            {
                key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_STRING_SKI_SHOP") ?? "");
            }


            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("Id", user.UserId.ToString() ?? ""),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Name ?? ""),
                    new Claim(JwtRegisteredClaimNames.Sub, user.LastName ?? ""),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                    new Claim("isAdmin", user.IsAdmin.ToString() ?? ""),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(7),
                SigningCredentials = new SigningCredentials
                (new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha512Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);            

            return jwtToken;
        }
    }
}

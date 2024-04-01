using backend_v2.DTOs;
using backend_v2.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace backend_v2.Utilities
{
    public static class JWTUtilities
    {
        public static string GenerateToken(User user, byte[] key)
        {
            Console.WriteLine($"{user} ");
            Console.WriteLine($"{key} ");
            Console.WriteLine($"MICHAEL TEST 2 GENERATE TOKEN");
            Console.WriteLine($"MICHAEL TEST 1 GENERATE TOKEN");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("Id", user.UserId.ToString() ?? ""),
                    new Claim("Name", user.Name ?? ""),
                    new Claim("Last Name", user.LastName ?? ""),
                    new Claim("Email", user.Email ?? ""),
                    new Claim("isAdmin", user.IsAdmin.ToString() ?? ""),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(7),
                SigningCredentials = new SigningCredentials
                (new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
            };
            Console.WriteLine($"{key} ");
            Console.WriteLine($"MICHAEL TEST 2 GENERATE TOKEN");
            var tokenHandler = new JwtSecurityTokenHandler();
            Console.WriteLine($"{key} ");
            Console.WriteLine($"MICHAEL TEST 3 GENERATE TOKEN");
            try
            {
                var token = tokenHandler.CreateToken(tokenDescriptor);
                Console.WriteLine($"MICHAEL TEST 4 GENERATE TOKEN");
                var jwtToken = tokenHandler.WriteToken(token);
                Console.WriteLine($"MICHAEL TEST 5 GENERATE TOKEN");
                return jwtToken;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An exception occurred:");
                Console.WriteLine($"Exception Type: {ex.GetType().FullName}");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine("Stack Trace:");
                Console.WriteLine(ex.StackTrace);

                // If the exception has an inner exception, log its details as well
                if (ex.InnerException != null)
                {
                    Console.WriteLine("Inner Exception:");
                    Console.WriteLine($"Exception Type: {ex.InnerException.GetType().FullName}");
                    Console.WriteLine($"Message: {ex.InnerException.Message}");
                    Console.WriteLine("Stack Trace:");
                    Console.WriteLine(ex.InnerException.StackTrace);
                }
                return "";
            }
        }

        public static UserTokenDto DecodeUserTokenInfo(string accessToken, byte[] key)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false
            };

            // Validate the token and extract claims
            var claimsPrincipal = tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out SecurityToken validatedToken);
            var jwtToken = (JwtSecurityToken)validatedToken;

            // Extract the necessary claims
            var isAdminClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == "isAdmin")?.Value;
            bool isAdmin = isAdminClaim != null && (isAdminClaim.Equals("True", StringComparison.OrdinalIgnoreCase) || isAdminClaim == "1");

            var customPayload = new Dictionary<string, string>();
            // List the types of claims you want to exclude
            var excludeClaims = new HashSet<string> { "nbf", "exp", "iat", "jti" };

            foreach (var claim in jwtToken.Payload)
            {
                // Exclude the claims based on their type
                if (!excludeClaims.Contains(claim.Key))
                {
                    customPayload.Add(claim.Key, claim.Value.ToString() ?? "");
                }
            }

            return new UserTokenDto { Token = customPayload, IsAdmin = isAdmin };
        }
    }
}

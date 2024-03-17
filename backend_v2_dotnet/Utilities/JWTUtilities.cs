using backend_v2.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend_v2.DTOs;

namespace backend_v2.Utilities
{
    public static class JWTUtilities
    {
        public static string GenerateToken(User user, byte[] key)
        {

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
                SecurityAlgorithms.HmacSha512Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);            

            return jwtToken;
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
                    customPayload.Add(claim.Key, claim.Value.ToString() ?? "" );
                }
            }

            return new UserTokenDto { Token = customPayload, IsAdmin = isAdmin };
        }
    }
}

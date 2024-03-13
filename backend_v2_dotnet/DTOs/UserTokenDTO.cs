using System.IdentityModel.Tokens.Jwt;

namespace backend_v2.DTOs
{
    public class UserTokenDto
    {
        public JwtSecurityToken Token { get; set; }
        public bool IsAdmin { get; set; }
    }

}

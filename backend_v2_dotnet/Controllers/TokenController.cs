using Microsoft.AspNetCore.Mvc;
using System.Text;
using backend_v2.Utilities;

namespace backend_v2.Controllers
{
    [ApiController]
    [Route("apiv2/")]

    public class TokenController : ControllerBase
    {
        private readonly ILogger<TokenController> _logger;        
        private readonly IConfiguration _configuration;        

        public TokenController(ILogger<TokenController> logger, IConfiguration configuration)
        {
            _logger = logger;            
            _configuration = configuration;            
        }

        [HttpGet("get-token", Name = "GetDecodedTokenRoute")]
        public ActionResult GetToken()
        {
            try
            {
                var accessToken = Request.Cookies["access_token"];                
                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? "");
                var UserTokenInfo = JWTUtilities.DecodeUserTokenInfo(accessToken ?? "", key);
                return Ok(UserTokenInfo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error decoding token from user.");
                return Unauthorized("Unauthorized. Invalid Token");
            }
        }
    }
}

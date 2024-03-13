using Microsoft.AspNetCore.Mvc;
using backend_v2.Models;
using backend_v2.DTOs;
using backend_v2.Utilities;
using System.Text;

namespace backend_v2.Controllers
{
    [ApiController]
    [Route("apiv2/[controller]")]    

    public class UsersController : ControllerBase
    {
        private readonly ILogger<APIStatusController> _logger;
        private readonly AlpinePeakDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UsersController(ILogger<APIStatusController> logger, AlpinePeakDbContext dbContext, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _dbContext = dbContext;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("login", Name = "LoginRoute")]        
        public ActionResult LoginUser(LoginRequestDto loginRequest)
        {            

            if (loginRequest == null || loginRequest?.Email == null || loginRequest?.Password == null)
            {
                _logger.LogWarning("Received invalid login request: Null or missing email/password.");
                return BadRequest("Login request is null");
            }

            _logger.LogInformation($"Received login request for email: {loginRequest.Email}");


            var user = _dbContext.Users.FirstOrDefault(u => u.Email == loginRequest.Email.ToLower());

            if (user == null)
            {
                _logger.LogWarning($"Login failed: User with email '{loginRequest.Email}' not found.");
                return Unauthorized("Wrong credentials");
            }

            var passwordMatches = BCryptUtils.ComparePasswords(loginRequest?.Password!, user?.Password!);

            if (!passwordMatches)
            {
                _logger.LogWarning($"Login failed: Incorrect password for user with email '{loginRequest?.Email}'.");
                return Unauthorized("Wrong credentials");
            }
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "");

            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
            {
                key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_STRING_SKI_SHOP") ?? "");
            }

            string token = JWTUtilities.GenerateToken(user!, key);

            CookieOptions cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            _httpContextAccessor.HttpContext.Response.Cookies.Append("access_token", token, cookieOptions);

            // Return success response
            return StatusCode(201, new
            {
                success = "user logged in",
                userLoggedIn = new
                {
                    _id = user.UserId,
                    name = user.Name,
                    lastName = user.LastName,
                    email = user.Email,
                    isAdmin = user.IsAdmin,
                    doNotLogout = loginRequest?.DoNotLogout ?? false
                }
            });
        }
    }
}

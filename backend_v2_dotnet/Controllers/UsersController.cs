using Microsoft.AspNetCore.Mvc;
using backend_v2.Models;
using backend_v2.DTOs;
using backend_v2.Utilities;

namespace backend_v2.Controllers
{
    [ApiController]
    [Route("apiv2/[controller]")]    

    public class UsersController : ControllerBase
    {
        private readonly ILogger<APIStatusController> _logger;
        private readonly AlpinePeakDbContext _dbContext;

        public UsersController(ILogger<APIStatusController> logger, AlpinePeakDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
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

            var passwordMatches = PasswordUtility.ComparePasswords(loginRequest?.Password!, user?.Password!);

            if (!passwordMatches)
            {
                _logger.LogWarning($"Login failed: Incorrect password for user with email '{loginRequest?.Email}'.");
                return Unauthorized("Wrong credentials");
            }

            _logger.LogInformation($"User with email '{loginRequest?.Email}' logged in successfully.");
            return Ok();
        }
    }
}

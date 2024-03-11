using Microsoft.AspNetCore.Mvc;
using backend_v2.Models;
using backend_v2.DTOs;

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
            _logger.LogInformation("Received Login Request!");

            if (loginRequest == null || loginRequest?.Email == null)
            {
                return BadRequest("Login request is null");
            }

            var user = _dbContext.Users.FirstOrDefault(u => u.Email == loginRequest.Email.ToLower());


            if (user == null)
            {
                return Unauthorized("Wrong credentials");
            }

            return Ok();
        }
    }
}

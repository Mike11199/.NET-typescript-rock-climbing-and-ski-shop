using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace backend_v2.Controllers
{
    [ApiController]
    [Route("apiv2/[controller]")]
    public class APIStatusController : ControllerBase
    {

        private readonly ILogger<APIStatusController> _logger;
        private readonly IConfiguration _configuration;

        public APIStatusController(ILogger<APIStatusController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        // *****/apiv2/apistatus/*****
        [HttpGet(Name = "GetAPIStatus")]
        public string Get()
        {
            _logger.LogInformation("Received API Request!");
            return "C# .NET APIv2 is active and running in ECS.";
        }

        // *****/apiv2/apistatus/protected*****
        [Authorize] // Apply the middleware
        [HttpGet("protected")]

        public string Protected()
        {
            _logger.LogInformation("Received Health Check Request with a verified JWT!");
            return "User is logged in - accessed a protected route with a token!";
        }
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace backend_v2.Controllers
{
    [ApiController]
    [Route("apiv2/[controller]")]
    public class APIStatusController : ControllerBase
     {

        private readonly ILogger<APIStatusController> _logger;

        public APIStatusController(ILogger<APIStatusController> logger)
        {
            _logger = logger;
        }

        // *****/apiv2/apistatus/health*****
        [HttpGet(Name = "GetAPIStatus")]
        public string Get()
        {
            _logger.LogInformation("Received API Request!");
            return "C# .NET APIv2 is active and running in ECS.";
        }

        // *****/apiv2/apistatus/protected*****
        [HttpGet("protected")]
        [Authorize] // Require authorization with JWT token
        public string Protected()
        {
            _logger.LogInformation("Received Health Check Request with a verified JWT!");
            return "OK";
        }
     }
}
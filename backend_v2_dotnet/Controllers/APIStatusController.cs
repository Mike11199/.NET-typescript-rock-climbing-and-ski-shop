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

            [HttpGet(Name = "GetWeatherForecast")]
            public string Get()
            {
                _logger.LogInformation("Received API Request!");
                return "C# .NET APIv2 is active and running in ECS.";
            }
        }
    }
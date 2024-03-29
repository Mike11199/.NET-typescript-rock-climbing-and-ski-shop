using backend_v2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_v2.Controllers
{
    [ApiController]
    [Route("apiv2/[controller]")]

    public class CategoriesController : ControllerBase
    {
        private readonly ILogger<APIStatusController> _logger;
        private readonly AlpinePeakDbContext _dbContext;

        public CategoriesController(ILogger<APIStatusController> logger, AlpinePeakDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        [HttpGet(Name = "GetAllCategories")]
        public async Task<ActionResult> GetCategories()

        {
            try
            {
                var categories = await _dbContext.Categories.OrderBy(c => c.Name).ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching categories.");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
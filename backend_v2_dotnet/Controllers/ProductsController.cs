using Microsoft.AspNetCore.Mvc;
using backend_v2.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_v2.Controllers
{
        [ApiController]
        [Route("apiv2/[controller]")]

    public class ProductsController : ControllerBase
    {
        private readonly ILogger<APIStatusController> _logger;
        private readonly AlpinePeakDbContext _dbContext;
        
        public ProductsController(ILogger<APIStatusController> logger, AlpinePeakDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        [HttpGet(Name = "ProductsRoute")]
        public async Task<ActionResult> GetProducts()

        {
            try
            {
                var recordsPerPage = 3;

                int pageNum;
                if (!int.TryParse(HttpContext.Request.Query["pageNum"].FirstOrDefault(), out pageNum))
                {
                    pageNum = 1;
                }

                var totalProducts = await _dbContext.Products.CountAsync();

                var products = await _dbContext.Products
                    .Include(p => p.Images)
                    .Skip((pageNum - 1) * recordsPerPage)
                    .Take(recordsPerPage)
                    .ToListAsync();

                return Ok(new
                {
                    products,
                    pageNum,
                    paginationLinksNumber = Math.Ceiling((double)totalProducts / recordsPerPage)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching products.");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
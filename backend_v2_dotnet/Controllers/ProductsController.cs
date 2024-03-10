using Microsoft.AspNetCore.Mvc;
using backend_v2.Models;

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
        public ActionResult<IEnumerable<Product>> GetProducts()
        {
            _logger.LogInformation("Received API Request!");
            var products = _dbContext.Products.ToList();
            return Ok(products);
        }
    }
}
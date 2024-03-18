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
        
        [HttpGet("bestsellers")]
        public async Task<ActionResult> GetBestSellers()

        {
            try
            {
                var topCategories = await _dbContext.Categories
                 .OrderBy(c => c.CategoryId) // Assuming you have some criteria to determine top categories
                 .Take(4)
                 .ToListAsync();

                var bestSellers = new List<Product>();


                foreach (var category in topCategories)
                {
                    var bestSellerInCategory = await _dbContext.Products
                        .Where(p => p.CategoryId == category.CategoryId && p.Sales > 0)
                        .OrderByDescending(p => p.Sales)
                        .Include(p => p.Category)
                        .FirstOrDefaultAsync();

                    if (bestSellerInCategory != null)
                    {
                        bestSellers.Add(bestSellerInCategory);
                    }
                }

                return Ok(bestSellers);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching bestsellers.");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
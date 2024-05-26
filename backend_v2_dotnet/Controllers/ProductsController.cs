using backend_v2.Models;
using backend_v2.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace backend_v2.Controllers
{
    [ApiController]
    [Route("apiv2/[controller]")]

    public class ProductsController : ControllerBase
    {
        private readonly ILogger<APIStatusController> _logger;
        private readonly IProductRepository _productRepository;

        public ProductsController
        (
            ILogger<APIStatusController> logger, 
            IProductRepository productRepository
        )
        {
            _logger = logger;
            _productRepository = productRepository;
        }

        // GET api/products/
        [HttpGet(Name = "ProductsRoute")]
        public async Task<ActionResult> GetProducts()

        {
            try
            {
                var recordsPerPage = 3;

                int pageNum = int.TryParse(HttpContext.Request.Query["pageNum"].FirstOrDefault(), out var tempPageNum) ? tempPageNum : 1;
                int? priceFilter = int.TryParse(HttpContext.Request.Query["price"].FirstOrDefault(), out var tempPrice) ? tempPrice : null;
                int? ratingFilter = int.TryParse(HttpContext.Request.Query["rating"].FirstOrDefault(), out var tempRating) ? tempRating : null;
                
                var sortOption = HttpContext.Request.Query["sort"].FirstOrDefault();
                var searchOption = HttpContext.Request.Query["search"].FirstOrDefault();
                var categoryFilter = HttpContext.Request.Query["category"].FirstOrDefault();


                var totalProducts = await _productRepository.GetAllProductsCount(searchOption, priceFilter, ratingFilter, categoryFilter);
                var products = await _productRepository.GetAllProductsPaginated(pageNum, recordsPerPage, sortOption, searchOption, priceFilter, ratingFilter, categoryFilter);

                return Ok(new
                {
                    products,
                    pageNum,
                    paginationLinksNumber = Math.Ceiling((double)totalProducts / recordsPerPage),
                    totalProducts
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching products.");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET api/products/bestsellers/
        [HttpGet("bestsellers")]
        public async Task<ActionResult> GetBestSellers()

        {
            try
            {
                var bestSellers = await _productRepository.GetBestSellers();
                return Ok(bestSellers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching bestsellers.");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET api/products/get-one/id
        [HttpGet("get-one/{id}")]
        public async Task<ActionResult> GetProductById(string id)
        {
            try
            {
                var product = await _productRepository.GetProductById(id);

                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while fetching product {id}.");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
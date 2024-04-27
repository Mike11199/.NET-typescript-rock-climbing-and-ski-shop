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

        public ProductsController(ILogger<APIStatusController> logger, IProductRepository productRepository)
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

                int pageNum;
                if (!int.TryParse(HttpContext.Request.Query["pageNum"].FirstOrDefault(), out pageNum))
                {
                    pageNum = 1;
                }

                var sortOption = HttpContext.Request.Query["sort"].FirstOrDefault();
                var searchOption = HttpContext.Request.Query["search"].FirstOrDefault();

                var totalProducts = await _productRepository.GetAllProductsCount(searchOption);
                var products = await _productRepository.GetAllProductsPaginated(pageNum, recordsPerPage, sortOption, searchOption);

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

        // GET api/products/category/boots?pageNum=1
        [HttpGet("category/{categoryName}")]
        public async Task<ActionResult> GetProductsByCategory(string categoryName)

        {
            try
            {
                int recordsPerPage = 3;
                int totalProductsInCategory = 0;
                IEnumerable<Product> productsInCategory;
                int pageNum = int.TryParse(HttpContext.Request.Query["pageNum"].FirstOrDefault(), out var tempPageNum) ? tempPageNum : 1;

                var sortOption = HttpContext.Request.Query["sort"].FirstOrDefault();
                var searchOption = HttpContext.Request.Query["search"].FirstOrDefault();

                if (!string.IsNullOrEmpty(categoryName))
                {
                    totalProductsInCategory = await _productRepository.GetProductsCountByCategory(categoryName, searchOption);
                }

                if (string.IsNullOrEmpty(categoryName) || totalProductsInCategory == 0)
                {
                    totalProductsInCategory = await _productRepository.GetAllProductsCount(searchOption);
                    productsInCategory = await _productRepository.GetAllProductsPaginated(pageNum, recordsPerPage, sortOption, searchOption);
                }
                else
                {
                    productsInCategory = await _productRepository.GetProductsByCategoryPaginated(categoryName, pageNum, recordsPerPage, sortOption, searchOption);
                }

                return Ok(new
                {
                    products = productsInCategory,
                    pageNum,
                    paginationLinksNumber = Math.Ceiling((double)totalProductsInCategory / recordsPerPage)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while fetching products for category {categoryName}.");
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
using backend_v2.Models;

namespace backend_v2.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsPaginated(int pageNum, int recordsPerPage, string? sortOption, string? searchOption, int? priceFilter, int? ratingFilter);
        Task<IEnumerable<Product>> GetBestSellers();
        Task<int> GetAllProductsCount(string? searchOption, int? priceFilter, int? ratingFilter);
        Task<int> GetProductsCountByCategory(string categoryName, string? searchOption, int? priceFilter, int? ratingFilter);
        Task<IEnumerable<Product>> GetProductsByCategoryPaginated(string categoryName, int pageNum, int recordsPerPage, string? sortOption, string? searchOption, int? priceFilter, int? ratingFilter);

        Task<Product?> GetProductById(string productId);
    }
}

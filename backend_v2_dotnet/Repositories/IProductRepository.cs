using backend_v2.Models;

namespace backend_v2.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsPaginated(int pageNum, int recordsPerPage, string? sortOption, string? searchOption, int? priceFilter, int? ratingFilter, string? categoryFilter);
        Task<IEnumerable<Product>> GetBestSellers();
        Task<int> GetAllProductsCount(string? searchOption, int? priceFilter, int? ratingFilter, string? categoryFilter);
        Task<Product?> GetProductById(string productId);
    }
}

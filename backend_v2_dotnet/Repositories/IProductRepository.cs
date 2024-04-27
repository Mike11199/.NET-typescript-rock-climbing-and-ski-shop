using backend_v2.Models;

namespace backend_v2.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsPaginated(int pageNum, int recordsPerPage, string? sortOption, string? searchOption, int? priceFilter);
        Task<IEnumerable<Product>> GetBestSellers();
        Task<int> GetAllProductsCount(string? searchOption, int? priceFilter);
        Task<int> GetProductsCountByCategory(string categoryName, string? searchOption, int? priceFilter);
        Task<IEnumerable<Product>> GetProductsByCategoryPaginated(string categoryName, int pageNum, int recordsPerPage, string? sortOption, string? searchOption, int? priceFilter);

        Task<Product> GetProductById(string productId);
    }
}

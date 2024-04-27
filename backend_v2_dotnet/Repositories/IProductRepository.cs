using backend_v2.Models;

namespace backend_v2.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsPaginated(int pageNum, int recordsPerPage, string? sortOption, string? searchOption);
        Task<IEnumerable<Product>> GetBestSellers();
        Task<int> GetAllProductsCount(string? searchOption);
        Task<int> GetProductsCountByCategory(string categoryName, string? searchOption);
        Task<IEnumerable<Product>> GetProductsByCategoryPaginated(string categoryName, int pageNum, int recordsPerPage, string? sortOption, string? searchOption);

        Task<Product> GetProductById(string productId);
    }
}

using backend_v2.Models;
using backend_v2.Repositories;
using Microsoft.EntityFrameworkCore;

public class ProductRepository : IProductRepository
{
    private readonly AlpinePeakDbContext _dbContext;

    public ProductRepository(AlpinePeakDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Product>> GetAllProductsPaginated(int pageNum, int recordsPerPage)
    {
        var products = await _dbContext.Products
            .Include(p => p.Images)
            .Skip((pageNum - 1) * recordsPerPage)
            .Take(recordsPerPage)
            .ToListAsync();

        return products;
    }

    public async Task<int> GetAllProductsCount()
    {
        var totalProductsCount = await _dbContext.Products.CountAsync();
        return totalProductsCount;
    }

    public async Task<int> GetProductsCountByCategory(string categoryName)
    {
        var totalProductsInCategory = await _dbContext.Products
            .Where(p => p.Category != null && p.Category.Name != null && EF.Functions.Like(p.Category.Name.ToLower(), categoryName.ToLower()))
            .CountAsync();

        return totalProductsInCategory;
    }

    public async Task<IEnumerable<Product>> GetProductsByCategoryPaginated(string categoryName, int pageNum, int recordsPerPage)
    {
        var productsInCategory = await _dbContext.Products
            .Where(p => p.Category != null && p.Category.Name != null && EF.Functions.Like(p.Category.Name.ToLower(), categoryName.ToLower()))
            .Include(p => p.Images)
            .Skip((pageNum - 1) * recordsPerPage)
            .Take(recordsPerPage)
            .ToListAsync();

        return productsInCategory;
    }

    public async Task<IEnumerable<Product>> GetBestSellers()
    {
        var topCategories = await _dbContext.Categories
            .OrderBy(c => c.CategoryId)
            .Distinct()
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

        return bestSellers;
    }

    public async Task<Product> GetProductById(string productId)
    {
        var productGuid = Guid.Parse(productId);

        var product = await _dbContext.Products
            .Where(p => p.ProductId == productGuid)
            .Include(p => p.Images)
            .FirstOrDefaultAsync();

        return product;
    }
}

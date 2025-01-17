﻿using backend_v2.Models;
using backend_v2.Repositories;
using Microsoft.EntityFrameworkCore;

public class ProductRepository : IProductRepository
{
    private readonly AlpinePeakDbContext _dbContext;

    public ProductRepository(AlpinePeakDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<IEnumerable<Product>> GetAllProductsPaginated(int pageNum, int recordsPerPage, string? sortOption, string? searchOption, int? priceFilter, int? ratingFilter, string? categoryFilter)
    {
        IQueryable<Product> query = _dbContext.Products
            .Include(p => p.Reviews)
            .Include(p => p.Images);

        // Add category filter
        if (categoryFilter != null)
        {
            query = query.Where(p => p.Category != null && p.Category.Name != null && p.Category.Name.ToLower().Contains(categoryFilter.ToLower()));
        }

        // Add search filter
        if (!string.IsNullOrEmpty(searchOption))
        {
            var lowerSearchOption = searchOption.ToLower();
            query = query.Where(p => (p.Name != null && p.Name.ToLower().Contains(lowerSearchOption)) || (p.Description != null && p.Description.ToLower().Contains(lowerSearchOption)));
        }

        // Add price filter
        if (priceFilter != null)
        {
            query = query.Where(p => p.Price <= priceFilter);
        }

        // Add product minimum rating filter (product rating must be equal or better)
        if (ratingFilter != null)
        {
            query = query.Where(p => p.Reviews.Average(r => r.Rating) >= ratingFilter);
        }

        // sorting drop down
        if (!string.IsNullOrEmpty(sortOption))
        {
            switch (sortOption.ToLower())
            {
                case "price_asc":
                    query = query.OrderBy(p => p.Price);
                    break;
                case "price_desc":
                    query = query.OrderByDescending(p => p.Price);
                    break;
                case "name_asc":
                    query = query.OrderBy(p => p.Name);
                    break;
                case "name_desc":
                    query = query.OrderByDescending(p => p.Name);
                    break;
                default:
                    break;
            }
        }

        var products = await query
            .Skip((pageNum - 1) * recordsPerPage)
            .Take(recordsPerPage)
            .ToListAsync();

        return products;
    }


    public async Task<int> GetAllProductsCount(string? searchOption, int? priceFilter, int? ratingFilter, string? categoryFilter)
    {
        IQueryable<Product> query = _dbContext.Products;
        
        // Add category filter
        if (categoryFilter != null)
        {
            query = query.Where(p => p.Category != null && p.Category.Name != null && p.Category.Name.ToLower().Contains(categoryFilter.ToLower()));
        }

        // Add search filter
        if (!string.IsNullOrEmpty(searchOption))
        {
            var lowerSearchOption = searchOption.ToLower();
            query = query.Where(p => (p.Name != null && p.Name.ToLower().Contains(lowerSearchOption)) || (p.Description != null && p.Description.ToLower().Contains(lowerSearchOption)));

        }

        // Add price filter
        if (priceFilter != null)
        {
            query = query.Where(p => p.Price <= priceFilter);
        }

        // Add product minimum rating filter (product rating must be equal or better)
        if (ratingFilter != null)
        {
            query = query.Where(p => p.Reviews.Average(r => r.Rating) >= ratingFilter);
        }

        var totalProductsCount = await query.CountAsync();
        return totalProductsCount;
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
                .Include(p => p.Images)
                .FirstOrDefaultAsync();

            if (bestSellerInCategory != null)
            {
                bestSellers.Add(bestSellerInCategory);
            }
        }

        return bestSellers;
    }

    public async Task<Product?> GetProductById(string productId)
    {
        var productGuid = Guid.Parse(productId);

        var product = await _dbContext.Products
            .Where(p => p.ProductId == productGuid)
            .Include(p => p.Images)
            .Include(p => p.Reviews)
            .ThenInclude(r => r.User)
            .FirstOrDefaultAsync();

        return product;
    }
}

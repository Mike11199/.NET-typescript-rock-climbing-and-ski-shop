using backend_v2.Models;
using backend_v2.Repositories;
using Microsoft.EntityFrameworkCore;

public class ReviewRepository : IReviewRepository
{
    private readonly AlpinePeakDbContext _dbContext;


    public ReviewRepository(AlpinePeakDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Review?> GetUserReviewByProduct(string productId, string userId)
    {
        var existingReview = await _dbContext.Reviews
            .FirstOrDefaultAsync(x => x.UserId.ToString() == userId && x.ProductId.ToString() == productId);

        return existingReview;
    }
    public async Task<Review?> CreateNewReview(Product productToReview, User userFromDb, int rating, string comment)
    {
        var newReviewId = Guid.NewGuid();

        // create new review
        var newReview = new Review
        {
            ReviewId = newReviewId,
            CreatedAt = DateTime.UtcNow,
            Product = productToReview,
            ProductId = productToReview.ProductId,
            UserId = userFromDb.UserId,
            User = userFromDb,
            Rating = rating,
            Comment = comment,
        };

        await _dbContext.Reviews.AddAsync(newReview);
        await _dbContext.SaveChangesAsync();

        return newReview;
    }
}

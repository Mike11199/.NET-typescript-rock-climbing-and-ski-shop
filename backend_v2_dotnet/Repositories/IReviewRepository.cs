using backend_v2.DTOs;
using backend_v2.Models;

namespace backend_v2.Repositories
{
    public interface IReviewRepository
    {
        Task<Review?> GetUserReviewByProduct(string productId, string userId);
        Task<Review?> CreateNewReview(Product productToReview, User userFromDb, int rating, string comment);
    }
}

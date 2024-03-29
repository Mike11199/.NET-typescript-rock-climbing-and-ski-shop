using backend_v2.Models;

namespace backend_v2.Repositories
{
    public interface IOrderRepository
    {
        Task<Order?> CreateNewOrder(Guid newOrderUserId);
    }
}

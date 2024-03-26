using backend_v2.DTOs;
using backend_v2.Models;

namespace backend_v2.Repositories
{
    public interface IOrderRepository
    {
        Task<Order?> CreateNewOrder();
    }
}

using backend_v2.Models;
using backend_v2.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AlpinePeakDbContext _context;

    public OrderRepository(AlpinePeakDbContext dbContext)
    {
        _context = dbContext;
    }

    public async Task<Order?> CreateNewOrder(Guid newOrderUserId)
    {
        var newOrderId = Guid.NewGuid();

        // create new order
        var newOrder = new Order
        {
            CreatedAt = DateTime.UtcNow,
            IsDelivered = 0,
            IsPaid = 0,
            OrderId = newOrderId,
            UserId = newOrderUserId
        };

        await _context.Orders.AddAsync(newOrder);

        return newOrder;
    }
}

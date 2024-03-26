
using backend_v2.Models;
using backend_v2.Repositories;

using Microsoft.EntityFrameworkCore;

public class OrderRepository : IOrderRepository
{
    private readonly AlpinePeakDbContext _dbContext;
 

    public OrderRepository(AlpinePeakDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Order?> CreateNewOrder()
    {
        var newOrder = await _dbContext.Orders.FirstOrDefaultAsync();
        return newOrder ?? null;
    }

}

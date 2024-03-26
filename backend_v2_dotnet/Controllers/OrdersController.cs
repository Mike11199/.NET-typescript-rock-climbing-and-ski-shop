using Microsoft.AspNetCore.Mvc;
using backend_v2.Models;
using backend_v2.DTOs;
using backend_v2.Repositories;

namespace backend_v2.Controllers
{
    [ApiController]
    [Route("apiv2/[controller]")]    

    public class OrdersController : ControllerBase
    {
        private readonly ILogger<APIStatusController> _logger;
        private readonly AlpinePeakDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IOrderRepository _orderRepository;

        public OrdersController(ILogger<APIStatusController> logger, AlpinePeakDbContext dbContext, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IOrderRepository orderRepository)
        {
            _logger = logger;
            _context = dbContext;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _orderRepository = orderRepository;
        }

        // POST: apiv2/orders/
        [HttpPost(Name = "createOrder")]
        public async Task<ActionResult> CreateOrder(CreateOrderDto createOrderRequest)
        {
            return StatusCode(200, new{ success = "Order created." });
        }
    }
}

using backend_v2.DTOs;
using backend_v2.Models;
using backend_v2.Repositories;
using backend_v2.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;

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
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;


        public OrdersController(
            ILogger<APIStatusController> logger,
            AlpinePeakDbContext dbContext,
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor,
            IOrderRepository orderRepository,
            IProductRepository productRepository,
            IUserRepository userRepository)
        { 
            _logger = logger;
            _context = dbContext;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _userRepository = userRepository;
        }

        // PUT: apiv2/orders/user/pay-order/{orderId}
        [HttpPut("user/pay-order/{orderId}")]
        [Authorize]
        public async Task<ActionResult> VerifyAndMarkOrderPaid(string orderId)
        {
            try
            {
                if (orderId == null)
                {
                    return BadRequest("Bad request - please provide a valid order id.");
                }

                var order = await _orderRepository.GetOrderById(Guid.Parse(orderId));

                if (order == null)
                {
                    return BadRequest("Bad request - order not found. Please provide a valid order id.");
                }
                order.IsPaid = 1;
                order.PaidAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return StatusCode(200, order);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error creating order!.", ex);
                return BadRequest("User not found, please log in to create an order.");
            }
        }

        // POST: apiv2/orders/
        [HttpGet(Name = "getUserOrder")]
        [Authorize]
        public async Task<ActionResult> GetAllUserOrders()
        {
            try
            {
                var userId = User?.FindFirst("Id")?.Value;

                if (userId == null)
                {
                    return BadRequest("User not found, please log in.");
                }

                var userFromDb = await _userRepository.GetUserById(Guid.Parse(userId));

                if (userFromDb == null)
                {
                    return BadRequest("User not found, please log in.");
                }

                var userOrders = await _orderRepository.GetAllOrdersbyUserId(userFromDb.UserId);

                return StatusCode(200, userOrders);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error creating order!.", ex);
                return BadRequest("User not found, please log in to create an order.");
            }
        }

        // GET apiv2/orders/user/orderId
        [HttpGet("user/{orderId}")]
        [Authorize]
        public async Task<ActionResult> GetOrderByIdForUser(string orderId)
        {
            try
            {
                if (orderId == null)
                {
                    return BadRequest("Bad request - please provide a valid order id.");
                }

                var order = await _orderRepository.GetOrderById(Guid.Parse(orderId));

                if (order == null)
                {
                    return BadRequest("Bad request - order not found. Please provide a valid order id.");
                }

                return StatusCode(200, order);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error creating order!.", ex);
                return BadRequest("User not found, please log in to create an order.");
            }
        }

        // POST: apiv2/orders/
        [HttpPost(Name = "createOrder")]
        [Authorize]
        public async Task<ActionResult> CreateOrder(CreateOrderDto createOrderRequest)
        {
            try
            {
                // this gets the user from the JWT security claim https://learn.microsoft.com/en-us/dotnet/api/system.security.claims.claimsprincipal?view=net-8.0
                // since we called [Authorize] this can't be spoofed somehow to create an order for another user.
                var userId = User?.FindFirst("Id")?.Value;                

                if (userId == null)
                {
                    return BadRequest("User not found, please log in to create an order.");
                }

                // verify that the request has all items
                if (string.IsNullOrEmpty(createOrderRequest.PaymentMethod))
                {
                    return BadRequest("Error - payment method missing.");
                }
                if (createOrderRequest.OrderItems.Count == 0)
                {
                    return BadRequest("Error - please add items to your order.");
                }

                var userFromDb = await _userRepository.GetUserById(Guid.Parse(userId));

                if (userFromDb == null)
                {
                    return BadRequest("User not found, please log in to create an order.");
                }

                var newOrder = await _orderRepository.CreateNewOrder(userFromDb.UserId);

                if (newOrder == null)
                {
                    return BadRequest("Error creating order.");
                }

                decimal orderTotal = 0.00M;
                int orderCount = 0;

                // loop and decrease quantity of each product, only save changes if all succeed
                foreach (var orderItem in createOrderRequest.OrderItems)
                {
                    Console.WriteLine(orderItem.ProductId);
                    var product = await _context.Products
                        .Where(p => p.ProductId == Guid.Parse(orderItem.ProductId))
                        .FirstOrDefaultAsync();

                    if (product == null)
                    {
                        return BadRequest("Product not found!");
                    }
                    if (product.Count < orderItem.Quantity)
                    {
                        return BadRequest("Not enough product quantity to fulfill order!");
                    }

                    product.Count -= orderItem.Quantity;
                    orderTotal += product.Price * orderItem.Quantity ?? 0;
                    orderCount += orderItem.Quantity;

                    // add order products to M:N table
                    var newOrderProductRecord = new OrderProductItem
                    {
                        OrderProductItemId = Guid.NewGuid(),
                        OrderId = newOrder.OrderId,
                        ProductId = product.ProductId,
                        Quantity = orderItem.Quantity,
                        Price = product.Price
                    };
                    await _context.OrderProductItems.AddAsync(newOrderProductRecord);
                }

                newOrder.OrderTotal = orderTotal;
                newOrder.PaymentMethod = createOrderRequest.PaymentMethod;
                newOrder.ItemCount = orderCount;
                await _context.SaveChangesAsync();
                return StatusCode(200, new { success = "Order created.", orderId = newOrder?.OrderId });
            }
            catch (Exception ex)
            {
                _logger.LogError("Error creating order!.", ex);
                return BadRequest("User not found, please log in to create an order.");
            }
        }
    }
}

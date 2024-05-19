using backend_v2.DTOs;
using backend_v2.Models;
using backend_v2.Repositories;
using backend_v2.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace backend_v2.Controllers
{
    [ApiController]
    [Route("apiv2/[controller]")]

    public class UsersController : ControllerBase
    {
        private readonly ILogger<APIStatusController> _logger;
        private readonly AlpinePeakDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;
        private readonly IReviewRepository _reviewRepository;
        public UsersController
        (
            ILogger<APIStatusController> logger,
            AlpinePeakDbContext dbContext,
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor,
            IUserRepository userRepository,
            IProductRepository productRepository,
            IReviewRepository reviewRepository
        )
        {
            _logger = logger;
            _context = dbContext;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _userRepository = userRepository;
            _productRepository = productRepository;
            _reviewRepository = reviewRepository;
        }

        // POST: apiv2/users/login
        [HttpPost("login", Name = "LoginRoute")]
        public async Task<ActionResult> LoginUser(LoginRequestDto loginRequest)
        {
            try
            {
                if (loginRequest == null || loginRequest?.Email == null || loginRequest?.Password == null)
                {
                    _logger.LogWarning("Received invalid login request: Null or missing email/password.");
                    return BadRequest("Login request is null");
                }

                _logger.LogInformation($"Received login request for email: {loginRequest.Email}");

                var user = await _userRepository.GetUserByEmail(loginRequest.Email);

                if (user == null)
                {
                    _logger.LogWarning($"Login failed: User with email '{loginRequest.Email}' not found.");
                    return Unauthorized("Wrong credentials");
                }

                _logger.LogInformation($"Found user: {user.UserId}");

                var passwordMatches = BCryptUtils.ComparePasswords(loginRequest?.Password!, user?.Password!);

                if (!passwordMatches)
                {
                    _logger.LogWarning($"Login failed: Incorrect password for user with email '{loginRequest?.Email}'.");
                    return Unauthorized("Wrong credentials");
                }

                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "");

                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
                {
                    key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? "");
                }

                string token = JWTUtilities.GenerateToken(user!, key);


                if (token == null || token == "")
                {
                    return BadRequest("Error creating token!");
                }

                // Return success response
                return StatusCode(200, new
                {
                    success = "user logged in",
                    token,
                    userLoggedIn = new
                    {
                        userId = user!.UserId,
                        name = user.Name,
                        lastName = user.LastName,
                        email = user.Email,
                        isAdmin = user.IsAdmin,
                        doNotLogout = loginRequest?.DoNotLogout ?? false
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in user login: ", ex);
                return StatusCode(500, "Internal server error while logging in user- please try logging in again.");
            }
        }


        // GET: apiv2/users/{id}
        [Authorize]
        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetUserProfile(string id)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId.ToString() == id);

                if (user == null)
                {
                    return NotFound();
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in user details: ", ex);
                return StatusCode(500, "Internal server error retrieving user details.");
            }
        }


        // POST: apiv2/users/register
        [HttpPost("register", Name = "RegisterRoute")]
        public async Task<ActionResult> RegisterUser(RegisterUserDto registerRequest)
        {

            if (registerRequest == null || registerRequest?.Name == null || registerRequest?.Email == null || registerRequest?.Password == null)
            {
                _logger.LogWarning("Received invalid registration request: Null or missing email/password/name.");
                return BadRequest("Register request is null");
            }

            _logger.LogInformation($"Received register request for email: {registerRequest.Email}");

            var findExistingUser = await _userRepository.GetUserByEmail(registerRequest.Email);
            var userAlreadyExists = findExistingUser != null;

            if (userAlreadyExists)
            {
                _logger.LogWarning($"Login failed: User with email '{registerRequest.Email}'. User already exists.");
                return BadRequest("User already exists!");
            }

            var newUser = await _userRepository.RegisterNewUser(registerRequest);

            if (newUser == null)
            {
                return BadRequest("Error creating user!");
            }

            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "");

            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
            {
                key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? "");
            }

            string token = JWTUtilities.GenerateToken(newUser!, key);

            if (token == null || token == "")
            {
                return BadRequest("Error creating token!");
            }

            // Return created response
            return StatusCode(201, new
            {
                success = "New user registered!",
                token,
                userLoggedIn = new
                {
                    userId = newUser?.UserId!,
                    name = newUser?.Name ?? "",
                    lastName = newUser?.LastName ?? "",
                    email = newUser?.Email ?? "",
                    isAdmin = false,
                    doNotLogout = false
                }
            });
        }

        // POST: apiv2/users/review/{productId}
        [Authorize]
        [HttpPost("review/{productId}", Name = "ReviewRoute")]
        public async Task<ActionResult> UserCreateProductReview(string productId, [FromBody] CreateReviewDto createReviewRequest)
        {
            try
            {
                _logger.LogInformation($"Product Id from Request: {productId}");

                //verify user info for review
                // this gets the user from the JWT security claim https://learn.microsoft.com/en-us/dotnet/api/system.security.claims.claimsprincipal?view=net-8.0
                // since we called [Authorize] this can't be spoofed somehow to create an order for another user.
                var userId = User?.FindFirst("Id")?.Value;

                if (userId == null)
                {
                    return BadRequest("User not found, please log in to create an order.");
                }

                var userFromDb = await _userRepository.GetUserById(Guid.Parse(userId));

                if (userFromDb == null)
                {
                    return BadRequest("User not found, please log in to review a product.");
                }

                _logger.LogInformation($"Found user: {userFromDb.UserId}");

                // validate review request
                if (string.IsNullOrEmpty(createReviewRequest.Comment))
                {
                    return BadRequest("Review comment cannot be empty.");
                }

                if (createReviewRequest.Rating <= 0 || createReviewRequest.Rating > 5)
                {
                    return BadRequest("Review rating must be between 1 and 5.");
                }

                // validate product to review exists
                var productToReview = await _productRepository.GetProductById(productId);

                if (productToReview == null)
                {
                    return BadRequest("Product to review not found.");
                }

                // ensure product is not already reviewed
                var existingReview = await _reviewRepository.GetUserReviewByProduct(productToReview.ProductId.ToString(), userFromDb.UserId.ToString()); 

                if (existingReview != null)
                {
                    return BadRequest("Product is already reviewed.");
                }

                // create and save review in db
                var newReview = await _reviewRepository.CreateNewReview(productToReview, userFromDb, createReviewRequest.Rating, createReviewRequest.Comment);

                if (newReview == null)
                {
                    return BadRequest("Error creating new review.");
                }

                // Return success response
                return StatusCode
                (200, new
                {
                    reviewId = newReview.ReviewId,
                    success = "New Review Created.",
                });
            }
            catch (Exception ex)
            {
                _logger.LogError("Error creating a product review: ", ex);
                return StatusCode(500, "Internal server error while creating a product review.");
            }
        }
    }

}

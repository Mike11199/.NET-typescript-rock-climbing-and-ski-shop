using backend_v2.DTOs;
using backend_v2.Repositories;
using backend_v2.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace backend_v2.Controllers
{
    [ApiController]
    [Route("apiv2/")]
    public class GoogleController : ControllerBase
    {
        private readonly ILogger<GoogleController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;

        public GoogleController(ILogger<GoogleController> logger, IConfiguration configuration, IUserRepository userRepository)
        {
            _logger = logger;
            _configuration = configuration;
            _userRepository = userRepository;
        }

        [HttpPost("signin-google")]
        public async Task<IActionResult> GoogleResponseTask([FromBody] GoogleOauthRequestDto loginRequest)
        {
            try
            {
                _logger.LogInformation(loginRequest.Token);
                var decodedToken = await DecodeGoogleToken(loginRequest.Token);

                if (decodedToken == null) return Unauthorized("Wrong credentials.  Error with Google login.");


                var googleClientId = _configuration["Google:ClientId"] ?? "";

                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
                {
                    googleClientId = Environment.GetEnvironmentVariable("GOOGLE_OAUTH_CLIENT_ID") ?? "";
                }

                if (decodedToken.Aud != googleClientId) return Unauthorized("Wrong credentials.  Error with Google login.");

                if (DateTime.UtcNow > DateTimeOffset.FromUnixTimeSeconds(decodedToken.Exp).DateTime) return Unauthorized("Token expired.");

                if (!decodedToken.EmailVerified) return Unauthorized("Wrong credentials.  Error with Google login.");

                // the rest of this code is essentially a copy of LoginUser() in UsersController.cs 
                var user = await _userRepository.GetUserByEmail(decodedToken.Email);

                if (user == null)
                {
                    _logger.LogWarning($"Login failed: User with email '{decodedToken.Email}' not found.");
                    return Unauthorized("Wrong credentials");
                }

                _logger.LogInformation($"Found user: {user.UserId}");

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
                        doNotLogout = true,
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in user login: ", ex);
                return StatusCode(500, "Internal server error while logging in user- please try logging in again.");
            }
        }

        /// <summary>
        /// Decodes a Google ID token by sending it to Google's tokeninfo endpoint. This method validates the token
        /// and decodes its contents into a <see cref="GoogleTokenDecodedDto"/> object.
        /// </summary>
        /// <param name="token">The Google ID token to decode and validate.</param>
        /// <returns>
        /// A <see cref="GoogleTokenDecodedDto"/> object containing the decoded token information if the token is valid;
        /// otherwise, null if the token is invalid or an error occurs.
        /// </returns>
        /// <exception cref="System.Net.Http.HttpRequestException">Thrown when an HTTP request fails.</exception>
        /// <remarks>
        /// The token validation is offloaded to Google through the requestUri endpoint.
        /// </remarks>
        private async Task<GoogleTokenDecodedDto?> DecodeGoogleToken(string token)
        {
            var httpClient = new HttpClient();
            var requestUri = $"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}";

            try
            {
                var response = await httpClient.GetAsync(requestUri);
                if (response.IsSuccessStatusCode)
                {

                    var tokenInfo = await response.Content.ReadAsAsync<GoogleTokenDecodedDto>();
                    return tokenInfo;
                }
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error decoding the Google Login JWT: {ex.Message}");
                return null;
            }
        }
    }
}
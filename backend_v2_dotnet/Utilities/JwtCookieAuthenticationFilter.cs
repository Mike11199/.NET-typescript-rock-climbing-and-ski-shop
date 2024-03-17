using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;


public class JwtCookieAuthenticationFilter : IAsyncAuthorizationFilter
{
    private readonly JwtSecurityTokenHandler _tokenHandler;
    private readonly IConfiguration _configuration;

    public JwtCookieAuthenticationFilter(IConfiguration configuration)
    {
        _tokenHandler = new JwtSecurityTokenHandler();
        _configuration = configuration;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var accessToken = context.HttpContext.Request.Cookies["access_token"];

        if (string.IsNullOrEmpty(accessToken))
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        try
        {
            // get JWT symmetric key from secrets.json (not committed to git) if local or from docker env if in prod (aws task definition - AWS SSM)
            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? "";
            }

            var token = _tokenHandler.ReadJwtToken(accessToken);
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey)),
                ValidateIssuer = false,
                ValidateAudience = false
            };

            _tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out SecurityToken validatedToken);
            var jwtToken = (JwtSecurityToken)validatedToken;

        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(ex.ToString());
            context.Result = new UnauthorizedResult();
            return;
        }
    }
}


[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class JwtCookieAuthenticationAttribute : TypeFilterAttribute
{
    public JwtCookieAuthenticationAttribute() : base(typeof(JwtCookieAuthenticationFilter))
    {
    }
}
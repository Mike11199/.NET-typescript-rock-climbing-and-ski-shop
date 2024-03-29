namespace backend_v2.DTOs
{
    public class UserTokenDto
    {
        public Dictionary<string, string> Token { get; set; } = new Dictionary<string, string>();
        public bool IsAdmin { get; set; }
    }

}

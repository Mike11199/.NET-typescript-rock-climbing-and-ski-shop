namespace backend_v2.DTOs
{
    public class LoginRequestDto
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
        public bool? DoNotLogout { get; set; }
    }

}

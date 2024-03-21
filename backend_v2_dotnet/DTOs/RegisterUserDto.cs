namespace backend_v2.DTOs
{
    public class RegisterUserDto
    {
        public required string Name { get; set; }

        public string? LastName { get; set; }

        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}

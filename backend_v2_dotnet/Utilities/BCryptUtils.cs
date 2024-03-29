namespace backend_v2.Utilities
{
    public static class BCryptUtils
    {
        private static readonly string _salt = BCrypt.Net.BCrypt.GenerateSalt(10);

        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, _salt);
        }
        public static bool ComparePasswords(string inputPassword, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(inputPassword, hashedPassword);
        }
    }
}
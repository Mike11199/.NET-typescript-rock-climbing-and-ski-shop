using Newtonsoft.Json;

namespace backend_v2.DTOs
{
    public class GoogleTokenDecodedDto
    {
        public string Iss { get; set; } // Issuer of the token (Google's URL).
        public string Azp { get; set; } // Authorized party (the client ID to which the ID was issued).
        public string Aud { get; set; } // Audience (should match your app's client ID).
        public string Sub { get; set; } // Subject identifier (unique ID for the user).
        public string Email { get; set; } // User's email address.
        [JsonProperty("email_verified")]
        public bool EmailVerified { get; set; } // True if the user's email has been verified.
        public long Nbf { get; set; } // Time before which the token must not be accepted (timestamp).
        public string Name { get; set; } // User's full name.
        public string Picture { get; set; } // URL of the user's profile picture.
        [JsonProperty("given_name")]

        public string GivenName { get; set; } // User's given name.
        [JsonProperty("family_name")]

        public string FamilyName { get; set; } // User's family name.
        public long Iat { get; set; } // Issued-at time (timestamp the token was issued).
        public long Exp { get; set; } // Expiration time of the token (timestamp).
        public string Jti { get; set; } // JWT ID, a unique identifier for this token.
        public string Alg { get; set; } // Algorithm used to sign the token (e.g., RS256).
        public string Kid { get; set; } // Key ID used to sign the token.
        public string Typ { get; set; } // Type of token, typically "JWT".
    }

}
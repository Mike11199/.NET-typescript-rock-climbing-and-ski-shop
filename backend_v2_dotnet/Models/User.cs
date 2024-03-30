using System;
using System.Collections.Generic;

namespace backend_v2.Models;

public partial class User
{
    public Guid UserId { get; set; }

    public string? Name { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public int? IsAdmin { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? Country { get; set; }

    public string? PhoneNumber { get; set; }

    public string? State { get; set; }

    public string? ZipCode { get; set; }
}

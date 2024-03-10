using System;
using System.Collections.Generic;

namespace backend_v2.Models;

public partial class Review
{
    public Guid ReviewId { get; set; }

    public string? Comment { get; set; }

    public int? Rating { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}

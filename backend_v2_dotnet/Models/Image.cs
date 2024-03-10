using System;
using System.Collections.Generic;

namespace backend_v2.Models;

public partial class Image
{
    public Guid ImageId { get; set; }

    public Guid? ProductId { get; set; }

    public string? ImageUrl { get; set; }
}

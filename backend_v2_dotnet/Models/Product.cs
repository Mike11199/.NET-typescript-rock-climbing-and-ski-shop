using System;
using System.Collections.Generic;

namespace backend_v2.Models;

public partial class Product
{
    public Guid ProductId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public Guid? CategoryId { get; set; }

    public int? Count { get; set; }

    public decimal? Price { get; set; }

    public virtual Category? Category { get; set; }
}

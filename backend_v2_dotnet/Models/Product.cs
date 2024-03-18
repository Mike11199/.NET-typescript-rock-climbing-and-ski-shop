using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_v2.Models;

public partial class Product
{
    public Guid ProductId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public Guid? CategoryId { get; set; }

    public int? Count { get; set; }

    public decimal? Price { get; set; }

    [Column("sales")]
    public int? Sales { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<Image> Images { get; set; } = new List<Image>();
}

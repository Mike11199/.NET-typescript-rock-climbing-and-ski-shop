using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_v2.Models;

/// <summary>
/// Intersection table between orders and products.
/// </summary>
public partial class OrderProductItem
{
    [Key]
    [Column("order_product_item_id")]
    public Guid OrderProductItemId { get; set; }

    public Guid? OrderId { get; set; }

    public Guid? ProductId { get; set; }

    public int? Quantity { get; set; }

    public decimal? Price { get; set; }
}

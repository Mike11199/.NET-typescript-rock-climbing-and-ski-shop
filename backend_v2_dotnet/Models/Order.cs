﻿namespace backend_v2.Models;

public partial class Order
{
    public Guid OrderId { get; set; }

    public Guid? UserId { get; set; }

    public int? IsPaid { get; set; }

    public int? IsDelivered { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? PaymentMethod { get; set; }

    public decimal? OrderTotal { get; set; }

    public int? ItemCount { get; set; }

    public DateTime? PaidAt { get; set; }

    public DateTime? DeliveredAt { get; set; }

    public virtual ICollection<OrderProductItem> OrderProductItems { get; set; } = new List<OrderProductItem>();
}

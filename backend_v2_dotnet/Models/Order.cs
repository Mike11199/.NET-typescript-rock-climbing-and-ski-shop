using System;
using System.Collections.Generic;

namespace backend_v2.Models;

public partial class Order
{
    public Guid OrderId { get; set; }

    public Guid? UserId { get; set; }

    public int? IsPaid { get; set; }

    public int? IsDelivered { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}

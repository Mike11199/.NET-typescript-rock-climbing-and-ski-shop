using System.ComponentModel.DataAnnotations.Schema;

namespace backend_v2.Models;

public partial class Review
{
    public Guid ReviewId { get; set; }

    public string? Comment { get; set; }

    public int? Rating { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [Column("product_id")]
    public Guid ProductId { get; set; }

    [Column("user_id")]
    public Guid UserId { get; set; }

    [ForeignKey("ProductId")]
    public required Product Product { get; set; }

    [ForeignKey("UserId")]
    public required User User { get; set; }
}

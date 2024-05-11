namespace backend_v2.Models;

public partial class Image
{
    public Guid ImageId { get; set; }

    public Guid? ProductId { get; set; }

    public string? ImageUrl { get; set; }

    public virtual Product? Product { get; set; }
    public bool? IsMainImage { get; set; } = false;
}

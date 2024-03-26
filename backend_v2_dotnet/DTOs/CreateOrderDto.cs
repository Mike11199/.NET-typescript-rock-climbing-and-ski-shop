namespace backend_v2.DTOs
{
    public class OrderProductDto
    {
        public required string ProductId { get; set; }
        public required int Quantity { get; set; }
    }

    public class CreateOrderDto
    {
        public List<OrderProductDto> OrderItems { get; set; } = new List<OrderProductDto>();
        public string PaymentMethod { get; set; } = "CASH";
    }
}

namespace backend_v2.DTOs
{
    public class CreateReviewDto
    {
        public required string Comment { get; set; }
        public required int Rating { get; set; }
    }
}
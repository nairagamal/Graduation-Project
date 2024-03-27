namespace ECommerce.API.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ProductCategory ProductCategory { get; set; } = new ProductCategory();
        public Offer Offer { get; set; } = new Offer();
        public double Price { get; set; }
        public int Quantity { get; set; }
        public string Color { get; set; } = string.Empty;
        public string ModelName { get; set; } = string.Empty;
        public string BrandName { get; set; } = string.Empty;
        public string ImageUrl1 { get; set; } = string.Empty;
        public string? ImageUrl2 { get; set; } = string.Empty;
        public string? ImageUrl3 { get; set; } = string.Empty;
        public string? ImageUrl4 { get; set; } = string.Empty;
        public string? ImageUrl5 { get; set; } = string.Empty;
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodDeliveryAPI.Models
{
    public class Dish
    {
        [Key]
        public int Id { get; set; }
        
        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal CurrentPrice { get; set; }

        public ICollection<DishPriceHistory> PriceHistories { get; set; } = new List<DishPriceHistory>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
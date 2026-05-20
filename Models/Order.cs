using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodDeliveryAPI.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public int ClientId { get; set; }
        public User? Client { get; set; }

        public int? CourierId { get; set; }
        public User? Courier { get; set; }

        public int StatusId { get; set; }
        public OrderStatus? Status { get; set; }

        public DateTime OrderDate { get; set; }
        public string DeliveryAddress { get; set; } = string.Empty;
        public string ChefComment { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        
        public DateTime? DeliveredTime { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
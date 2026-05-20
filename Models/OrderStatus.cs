using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryAPI.Models
{
    public class OrderStatus
    {
        [Key]
        public int Id { get; set; }
        public string StatusName { get; set; } = string.Empty; 

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
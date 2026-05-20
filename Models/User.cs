using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Role { get; set; } = string.Empty; 
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

    
        public ICollection<Order> ClientOrders { get; set; } = new List<Order>();
        public ICollection<Order> CourierOrders { get; set; } = new List<Order>();
    }
}
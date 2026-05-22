using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryAPI.DTOs
{
    public class CreateOrderDto
    {
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        public string DeliveryAddress { get; set; } = string.Empty;
        
        public string ChefComment { get; set; } = string.Empty;

        [Required]
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
    }

    public class CartItemDto
    {
        public int DishId { get; set; }
        public int Quantity { get; set; }
    }
}
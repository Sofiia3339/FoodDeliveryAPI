using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodDeliveryAPI.Models
{
    public class DishPriceHistory
    {
        [Key]
        public int Id { get; set; }
        
        public int DishId { get; set; }
        public Dish? Dish { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal OldPrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal NewPrice { get; set; }
        
        public DateTime ChangeDate { get; set; }
    }
}
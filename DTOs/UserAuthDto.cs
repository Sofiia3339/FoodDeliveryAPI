using System.ComponentModel.DataAnnotations;

namespace FoodDeliveryAPI.DTOs
{
    // Клас для прецеденту "Авторизація"
    public class LoginDto
    {
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }

    // Клас для прецеденту "Реєстрація" 
    public class RegisterDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty; 
        [Required]
        public string Phone { get; set; } = string.Empty;   
        [Required]
        public string Email { get; set; } = string.Empty;   
        [Required]
        public string Password { get; set; } = string.Empty; 
        
        [Required]
        public string Role { get; set; } = "Client";
    }
}
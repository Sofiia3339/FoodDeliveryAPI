using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.Models;
using FoodDeliveryAPI.DTOs;
using System.Threading.Tasks;

namespace FoodDeliveryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly FoodDeliveryContext _context;

        public UsersController(FoodDeliveryContext context)
        {
            _context = context;
        }

        // POST: api/Users/register
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterDto dto)
        {
            // Перевірка, чи не зайнятий email
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest("Користувач з таким Email вже існує.");
            }

            var user = new User
            {
                FullName = dto.FullName,
                Phone = dto.Phone,
                Email = dto.Email,
                PasswordHash = dto.Password, 
                Role = dto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Login), new { id = user.Id }, user);
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.PasswordHash == dto.Password);

            if (user == null)
            {
                return Unauthorized("Невірний Email або Пароль.");
            }

            return Ok(user);
        }
    }
}
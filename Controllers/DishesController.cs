using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace FoodDeliveryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DishesController : ControllerBase
    {
        private readonly FoodDeliveryContext _context;

        public DishesController(FoodDeliveryContext context)
        {
            _context = context;
        }

        // GET: api/Dishes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetDishes()
        {
            var dishes = await _context.Dishes
                .Include(d => d.Category)
                .Select(d => new {
                    d.Id,
                    d.Name,
                    d.Description,
                    d.CurrentPrice,
                    d.CategoryId,
                    CategoryName = d.Category != null ? d.Category.Name : "Без категорії"
                })
                .ToListAsync();

            return Ok(dishes);
        }

        // POST: api/Dishes
        [HttpPost]
        public async Task<ActionResult<Dish>> PostDish(Dish dish)
        {
            _context.Dishes.Add(dish);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetDish", new { id = dish.Id }, dish);
        }

        // GET: api/Dishes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Dish>> GetDish(int id)
        {
            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null) return NotFound();
            return dish;
        }

        // PUT: api/Dishes/5 
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDish(int id, Dish dish)
        {
            if (id != dish.Id) return BadRequest("ID не співпадає.");

            //Дістаємо стару версію страви з бази даних без відстеження
            var oldDish = await _context.Dishes.AsNoTracking().FirstOrDefaultAsync(d => d.Id == id);
            
            if (oldDish == null) return NotFound("Страву не знайдено.");

            // Перевіряємо чи ціна змінилася, записуємо історію
            if (oldDish.CurrentPrice != dish.CurrentPrice)
            {
                var historyRecord = new DishPriceHistory
                {
                    DishId = dish.Id,
                    OldPrice = oldDish.CurrentPrice,
                    NewPrice = dish.CurrentPrice,
                    ChangeDate = DateTime.Now
                };
                
                // Додаємо запис історії в контекст
                _context.DishPriceHistories.Add(historyRecord);
            }

            // Оновлюємо саму страву
            _context.Entry(dish).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DishExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Dishes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDish(int id)
        {
            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null) return NotFound();

            _context.Dishes.Remove(dish);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DishExists(int id)
        {
            return _context.Dishes.Any(e => e.Id == id);
        }
    }
}
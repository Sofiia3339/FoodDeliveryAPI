using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodDeliveryAPI.Data;
using FoodDeliveryAPI.Models;
using FoodDeliveryAPI.DTOs;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace FoodDeliveryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly FoodDeliveryContext _context;

        public OrdersController(FoodDeliveryContext context)
        {
            _context = context;
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto dto)
        {
            if (dto.Items == null || !dto.Items.Any())
            {
                return BadRequest("Кошик порожній!");
            }

            var order = new Order
            {
                ClientId = dto.ClientId,
                DeliveryAddress = dto.DeliveryAddress,
                ChefComment = dto.ChefComment,
                OrderDate = DateTime.Now,
                StatusId = 1, 
                OrderItems = new List<OrderItem>()
            };

            decimal totalAmount = 0;

            foreach (var item in dto.Items)
            {
                var dish = await _context.Dishes.FindAsync(item.DishId);
                if (dish == null) continue;

                var rowTotal = dish.CurrentPrice * item.Quantity;
                totalAmount += rowTotal;

                order.OrderItems.Add(new OrderItem
                {
                    DishId = dish.Id,
                    Quantity = item.Quantity,
                    UnitPrice = dish.CurrentPrice, 
                    RowTotalPrice = rowTotal
                });
            }

            order.TotalAmount = totalAmount;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Замовлення успішно оформлено", OrderId = order.Id });
        }

        // GET: api/Orders/available
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<object>>> GetAvailableOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Client)
                .Where(o => o.StatusId == 1 && o.CourierId == null) 
                .Select(o => new {
                    o.Id,
                    o.DeliveryAddress,
                    o.ChefComment,
                    o.TotalAmount,
                    o.OrderDate,
                    ClientName = o.Client.FullName,
                    ClientPhone = o.Client.Phone
                })
                .ToListAsync();

            return Ok(orders);
        }

        // GET: api/Orders/courier/5
        [HttpGet("courier/{courierId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetCourierOrders(int courierId)
        {
            var orders = await _context.Orders
                .Include(o => o.Client)
                .Include(o => o.Status)
                .Where(o => o.CourierId == courierId && (o.StatusId == 2 || o.StatusId == 4)) 
                .Select(o => new {
                    o.Id,
                    o.DeliveryAddress,
                    o.ChefComment,
                    o.TotalAmount,
                    StatusName = o.Status.StatusName,
                    ClientName = o.Client.FullName,
                    ClientPhone = o.Client.Phone
                })
                .ToListAsync();

            return Ok(orders);
        }

        // PUT: api/Orders/5/take
        [HttpPut("{id}/take")]
        public async Task<IActionResult> TakeOrder(int id, [FromBody] int courierId)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.CourierId = courierId;
            order.StatusId = 2; 
            
            await _context.SaveChangesAsync();
            return Ok();
        }

        // PUT: api/Orders/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] int statusId)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.StatusId = statusId;

            if (statusId == 3)
            {
                order.DeliveredTime = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
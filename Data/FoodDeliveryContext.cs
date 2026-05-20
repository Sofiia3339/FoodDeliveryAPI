using FoodDeliveryAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDeliveryAPI.Data
{
    public class FoodDeliveryContext : DbContext
    {
        public FoodDeliveryContext(DbContextOptions<FoodDeliveryContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Dish> Dishes { get; set; }
        public DbSet<DishPriceHistory> DishPriceHistories { get; set; }
        public DbSet<OrderStatus> OrderStatuses { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Client)
                .WithMany(u => u.ClientOrders)
                .HasForeignKey(o => o.ClientId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Courier)
                .WithMany(u => u.CourierOrders)
                .HasForeignKey(o => o.CourierId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
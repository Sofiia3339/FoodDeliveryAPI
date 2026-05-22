using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodDeliveryAPI.Data;
using ClosedXML.Excel;
using System.IO;
using System.Threading.Tasks;
using System.Linq;

namespace FoodDeliveryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly FoodDeliveryContext _context;

        public ReportsController(FoodDeliveryContext context)
        {
            _context = context;
        }

        // GET: api/Reports/export
        [HttpGet("export")]
        public async Task<IActionResult> ExportSalesToExcel()
        {
            // Отримуємо всі замовлення з бази даних (разом зі Статусом та Клієнтом)
            var orders = await _context.Orders
                .Include(o => o.Status)
                .Include(o => o.Client)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            // Створюємо віртуальний Excel-документ
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Звіт про продажі");

                // Формуємо заголовки колонок 
                worksheet.Cell(1, 1).Value = "ID Замовлення";
                worksheet.Cell(1, 2).Value = "Дата оформлення";
                worksheet.Cell(1, 3).Value = "ПІБ Клієнта";
                worksheet.Cell(1, 4).Value = "Сума (₴)";
                worksheet.Cell(1, 5).Value = "Статус";

                var headerRow = worksheet.Range("A1:E1");
                headerRow.Style.Font.Bold = true;
                headerRow.Style.Fill.BackgroundColor = XLColor.LightGray;

                // Заповнюємо рядки даними з бази
                int currentRow = 2;
                foreach (var order in orders)
                {
                    worksheet.Cell(currentRow, 1).Value = order.Id;
                    worksheet.Cell(currentRow, 2).Value = order.OrderDate.ToString("dd.MM.yyyy HH:mm");
                    worksheet.Cell(currentRow, 3).Value = order.Client?.FullName ?? "Невідомий";
                    worksheet.Cell(currentRow, 4).Value = order.TotalAmount;
                    worksheet.Cell(currentRow, 5).Value = order.Status?.StatusName ?? "Немає статусу";
                    
                    currentRow++;
                }

                worksheet.Columns().AdjustToContents();

                // Перетворюємо Excel-документ у масив байтів (Stream) для відправки через Інтернет
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    // Повертаємо файл користувачу
                    return File(
                        content, 
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        "Sales_Report.xlsx"
                    );
                }
            }
        }
    }
}
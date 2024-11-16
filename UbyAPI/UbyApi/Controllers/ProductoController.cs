using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UbyApi.Models;

namespace UbyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoController : ControllerBase
    {
        private readonly ProductoContext _context;

        public ProductoController(ProductoContext context)
        {
            _context = context;
        }

        // GET: api/Producto
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoItem>>> GetProductos()
        {
            return await _context.Productos.ToListAsync();
        }

        // GET: api/Producto/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoItem>> GetProductoItem(int id)
        {
            var productoItem = await _context.Productos.FindAsync(id);

            if (productoItem == null)
            {
                return NotFound();
            }

            return productoItem;
        }

        // PUT: api/Producto/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductoItem(int id, ProductoItem productoItem)
        {
            if (id != productoItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(productoItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Producto
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductoItem>> PostProductoItem(ProductoItem productoItem)
        {
            _context.Productos.Add(productoItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductoItem", new { id = productoItem.Id }, productoItem);
        }

        // DELETE: api/Producto/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductoItem(int id)
        {
            var productoItem = await _context.Productos.FindAsync(id);
            if (productoItem == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(productoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductoItemExists(int id)
        {
            return _context.Productos.Any(e => e.Id == id);
        }
    }
}

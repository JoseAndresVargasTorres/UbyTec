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
    public class DireccionRepartidorController : ControllerBase
    {
        private readonly DireccionRepartidorContext _context;

        public DireccionRepartidorController(DireccionRepartidorContext context)
        {
            _context = context;
        }

        // GET: api/DireccionRepartidor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DireccionRepartidorItem>>> GetDireccionRepartidor()
        {
            return await _context.DireccionRepartidor.ToListAsync();
        }

        // GET: api/DireccionRepartidor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DireccionRepartidorItem>> GetDireccionRepartidorItem(int id)
        {
            var direccionRepartidorItem = await _context.DireccionRepartidor.FindAsync(id);

            if (direccionRepartidorItem == null)
            {
                return NotFound();
            }

            return direccionRepartidorItem;
        }

        // PUT: api/DireccionRepartidor/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDireccionRepartidorItem(int id, DireccionRepartidorItem direccionRepartidorItem)
        {
            if (id != direccionRepartidorItem.Id_Repartidor)
            {
                return BadRequest();
            }

            _context.Entry(direccionRepartidorItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DireccionRepartidorItemExists(id))
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

        // POST: api/DireccionRepartidor
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DireccionRepartidorItem>> PostDireccionRepartidorItem(DireccionRepartidorItem direccionRepartidorItem)
        {
            _context.DireccionRepartidor.Add(direccionRepartidorItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDireccionRepartidorItem", new { id = direccionRepartidorItem.Id_Repartidor }, direccionRepartidorItem);
        }

        // DELETE: api/DireccionRepartidor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDireccionRepartidorItem(int id)
        {
            var direccionRepartidorItem = await _context.DireccionRepartidor.FindAsync(id);
            if (direccionRepartidorItem == null)
            {
                return NotFound();
            }

            _context.DireccionRepartidor.Remove(direccionRepartidorItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DireccionRepartidorItemExists(int id)
        {
            return _context.DireccionRepartidor.Any(e => e.Id_Repartidor == id);
        }
    }
}

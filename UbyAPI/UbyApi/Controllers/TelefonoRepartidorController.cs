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
    public class TelefonoRepartidorController : ControllerBase
    {
        private readonly TelefonoRepartidorContext _context;

        public TelefonoRepartidorController(TelefonoRepartidorContext context)
        {
            _context = context;
        }

        // GET: api/TelefonoRepartidor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TelefonoRepartidorItem>>> GetTelefonoRepartidor()
        {
            return await _context.TelefonoRepartidor.ToListAsync();
        }

        // GET: api/TelefonoRepartidor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TelefonoRepartidorItem>> GetTelefonoRepartidorItem(int id)
        {
            var telefonoRepartidorItem = await _context.TelefonoRepartidor.FindAsync(id);

            if (telefonoRepartidorItem == null)
            {
                return NotFound();
            }

            return telefonoRepartidorItem;
        }

        // PUT: api/TelefonoRepartidor/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTelefonoRepartidorItem(int id, TelefonoRepartidorItem telefonoRepartidorItem)
        {
            if (id != telefonoRepartidorItem.CedulaRepartidor)
            {
                return BadRequest();
            }

            _context.Entry(telefonoRepartidorItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TelefonoRepartidorItemExists(id))
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

        // POST: api/TelefonoRepartidor
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TelefonoRepartidorItem>> PostTelefonoRepartidorItem(TelefonoRepartidorItem telefonoRepartidorItem)
        {
            _context.TelefonoRepartidor.Add(telefonoRepartidorItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTelefonoRepartidorItem", new { id = telefonoRepartidorItem.CedulaRepartidor }, telefonoRepartidorItem);
        }

        // DELETE: api/TelefonoRepartidor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTelefonoRepartidorItem(int id)
        {
            var telefonoRepartidorItem = await _context.TelefonoRepartidor.FindAsync(id);
            if (telefonoRepartidorItem == null)
            {
                return NotFound();
            }

            _context.TelefonoRepartidor.Remove(telefonoRepartidorItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TelefonoRepartidorItemExists(int id)
        {
            return _context.TelefonoRepartidor.Any(e => e.CedulaRepartidor == id);
        }
    }
}

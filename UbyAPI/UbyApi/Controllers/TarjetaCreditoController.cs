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
    public class TarjetaCreditoController : ControllerBase
    {
        private readonly TarjetaCreditoContext _context;

        public TarjetaCreditoController(TarjetaCreditoContext context)
        {
            _context = context;
        }

        // GET: api/TarjetaCredito
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TarjetaCreditoItem>>> GetTarjetasCredito()
        {
            return await _context.TarjetasCredito.ToListAsync();
        }

        // GET: api/TarjetaCredito/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TarjetaCreditoItem>> GetTarjetaCreditoItem(long id)
        {
            var tarjetaCreditoItem = await _context.TarjetasCredito.FindAsync(id);

            if (tarjetaCreditoItem == null)
            {
                return NotFound();
            }

            return tarjetaCreditoItem;
        }

        // PUT: api/TarjetaCredito/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTarjetaCreditoItem(long id, TarjetaCreditoItem tarjetaCreditoItem)
        {
            if (id != tarjetaCreditoItem.NumeroTarjeta)
            {
                return BadRequest();
            }

            _context.Entry(tarjetaCreditoItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TarjetaCreditoItemExists(id))
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

        // POST: api/TarjetaCredito
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TarjetaCreditoItem>> PostTarjetaCreditoItem(TarjetaCreditoItem tarjetaCreditoItem)
        {
            _context.TarjetasCredito.Add(tarjetaCreditoItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTarjetaCreditoItem", new { id = tarjetaCreditoItem.NumeroTarjeta }, tarjetaCreditoItem);
        }

        // DELETE: api/TarjetaCredito/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTarjetaCreditoItem(long id)
        {
            var tarjetaCreditoItem = await _context.TarjetasCredito.FindAsync(id);
            if (tarjetaCreditoItem == null)
            {
                return NotFound();
            }

            _context.TarjetasCredito.Remove(tarjetaCreditoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TarjetaCreditoItemExists(long id)
        {
            return _context.TarjetasCredito.Any(e => e.NumeroTarjeta == id);
        }
    }
}

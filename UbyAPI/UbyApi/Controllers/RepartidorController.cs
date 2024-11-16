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
    public class RepartidorController : ControllerBase
    {
        private readonly RepartidorContext _context;

        public RepartidorController(RepartidorContext context)
        {
            _context = context;
        }

        // GET: api/Repartidor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RepartidorItem>>> GetRepartidores()
        {
            return await _context.Repartidores.ToListAsync();
        }

        // GET: api/Repartidor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RepartidorItem>> GetRepartidorItem(int id)
        {
            var repartidorItem = await _context.Repartidores.FindAsync(id);

            if (repartidorItem == null)
            {
                return NotFound();
            }

            return repartidorItem;
        }

        // PUT: api/Repartidor/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRepartidorItem(int id, RepartidorItem repartidorItem)
        {
            if (id != repartidorItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(repartidorItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RepartidorItemExists(id))
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

        // POST: api/Repartidor
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RepartidorItem>> PostRepartidorItem(RepartidorItem repartidorItem)
        {
            _context.Repartidores.Add(repartidorItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRepartidorItem", new { id = repartidorItem.Id }, repartidorItem);
        }

        // DELETE: api/Repartidor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRepartidorItem(int id)
        {
            var repartidorItem = await _context.Repartidores.FindAsync(id);
            if (repartidorItem == null)
            {
                return NotFound();
            }

            _context.Repartidores.Remove(repartidorItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RepartidorItemExists(int id)
        {
            return _context.Repartidores.Any(e => e.Id == id);
        }
    }
}

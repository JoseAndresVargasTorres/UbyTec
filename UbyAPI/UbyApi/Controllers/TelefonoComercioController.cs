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
    public class TelefonoComercioController : ControllerBase
    {
        private readonly TelefonoComercioContext _context;

        public TelefonoComercioController(TelefonoComercioContext context)
        {
            _context = context;
        }

        // GET: api/TelefonoComercio
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TelefonoComercioItem>>> GetTelefonoComercio()
        {
            return await _context.TelefonoComercio.ToListAsync();
        }

        // GET: api/TelefonoComercio/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TelefonoComercioItem>> GetTelefonoComercioItem(string id)
        {
            var telefonoComercioItem = await _context.TelefonoComercio.FindAsync(id);

            if (telefonoComercioItem == null)
            {
                return NotFound();
            }

            return telefonoComercioItem;
        }

        // PUT: api/TelefonoComercio/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTelefonoComercioItem(string id, TelefonoComercioItem telefonoComercioItem)
        {
            if (id != telefonoComercioItem.CedulaComercio)
            {
                return BadRequest();
            }

            _context.Entry(telefonoComercioItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TelefonoComercioItemExists(id))
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

        // POST: api/TelefonoComercio
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TelefonoComercioItem>> PostTelefonoComercioItem(TelefonoComercioItem telefonoComercioItem)
        {
            _context.TelefonoComercio.Add(telefonoComercioItem);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TelefonoComercioItemExists(telefonoComercioItem.CedulaComercio))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTelefonoComercioItem", new { id = telefonoComercioItem.CedulaComercio }, telefonoComercioItem);
        }

        // DELETE: api/TelefonoComercio/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTelefonoComercioItem(string id)
        {
            var telefonoComercioItem = await _context.TelefonoComercio.FindAsync(id);
            if (telefonoComercioItem == null)
            {
                return NotFound();
            }

            _context.TelefonoComercio.Remove(telefonoComercioItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TelefonoComercioItemExists(string id)
        {
            return _context.TelefonoComercio.Any(e => e.CedulaComercio == id);
        }
    }
}

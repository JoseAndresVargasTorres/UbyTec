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
    public class TelefonoClienteController : ControllerBase
    {
        private readonly TelefonoClienteContext _context;

        public TelefonoClienteController(TelefonoClienteContext context)
        {
            _context = context;
        }

        // GET: api/TelefonoCliente
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TelefonoClienteItem>>> GetTelefonosCliente()
        {
            return await _context.TelefonosCliente.ToListAsync();
        }

        // GET: api/TelefonoCliente/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TelefonoClienteItem>> GetTelefonoClienteItem(int id)
        {
            var telefonoClienteItem = await _context.TelefonosCliente.FindAsync(id);

            if (telefonoClienteItem == null)
            {
                return NotFound();
            }

            return telefonoClienteItem;
        }

        // PUT: api/TelefonoCliente/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTelefonoClienteItem(int id, TelefonoClienteItem telefonoClienteItem)
        {
            if (id != telefonoClienteItem.CedulaCliente)
            {
                return BadRequest();
            }

            _context.Entry(telefonoClienteItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TelefonoClienteItemExists(id))
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

        // POST: api/TelefonoCliente
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TelefonoClienteItem>> PostTelefonoClienteItem(TelefonoClienteItem telefonoClienteItem)
        {
            _context.TelefonosCliente.Add(telefonoClienteItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTelefonoClienteItem", new { id = telefonoClienteItem.CedulaCliente }, telefonoClienteItem);
        }

        // DELETE: api/TelefonoCliente/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTelefonoClienteItem(int id)
        {
            var telefonoClienteItem = await _context.TelefonosCliente.FindAsync(id);
            if (telefonoClienteItem == null)
            {
                return NotFound();
            }

            _context.TelefonosCliente.Remove(telefonoClienteItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TelefonoClienteItemExists(int id)
        {
            return _context.TelefonosCliente.Any(e => e.CedulaCliente == id);
        }
    }
}

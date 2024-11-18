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
        public async Task<ActionResult<IEnumerable<TelefonoClienteItem>>> GetTelefonoCliente()
        {
            return await _context.TelefonoCliente.ToListAsync();
        }

        // GET: api/TelefonoCliente/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TelefonoClienteItem>> GetTelefonoClienteItem(int id)
        {
            var telefonoClienteItem = await _context.TelefonoCliente.FindAsync(id);

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
            if (id != telefonoClienteItem.Cedula_Cliente)
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
            _context.TelefonoCliente.Add(telefonoClienteItem);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TelefonoClienteItemExists(telefonoClienteItem.Cedula_Cliente))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTelefonoClienteItem", new { id = telefonoClienteItem.Cedula_Cliente }, telefonoClienteItem);
        }

        // DELETE: api/TelefonoCliente/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTelefonoClienteItem(int id)
        {
            var telefonoClienteItem = await _context.TelefonoCliente.FindAsync(id);
            if (telefonoClienteItem == null)
            {
                return NotFound();
            }

            _context.TelefonoCliente.Remove(telefonoClienteItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TelefonoClienteItemExists(int id)
        {
            return _context.TelefonoCliente.Any(e => e.Cedula_Cliente == id);
        }
    }
}

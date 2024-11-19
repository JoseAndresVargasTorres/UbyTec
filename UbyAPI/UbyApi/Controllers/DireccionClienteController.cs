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
    public class DireccionClienteController : ControllerBase
    {
        private readonly DireccionClienteContext _context;

        public DireccionClienteController(DireccionClienteContext context)
        {
            _context = context;
        }

        // GET: api/DireccionCliente
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DireccionClienteItem>>> GetDireccionAdministrador()
        {
            return await _context.DireccionAdministrador.ToListAsync();
        }

        // GET: api/DireccionCliente/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DireccionClienteItem>> GetDireccionClienteItem(string id)
        {
            var direccionClienteItem = await _context.DireccionAdministrador.FindAsync(id);

            if (direccionClienteItem == null)
            {
                return NotFound();
            }

            return direccionClienteItem;
        }

        // PUT: api/DireccionCliente/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDireccionClienteItem(string id, DireccionClienteItem direccionClienteItem)
        {
            if (id != direccionClienteItem.Id_Cliente)
            {
                return BadRequest();
            }

            _context.Entry(direccionClienteItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DireccionClienteItemExists(id))
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

        // POST: api/DireccionCliente
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DireccionClienteItem>> PostDireccionClienteItem(DireccionClienteItem direccionClienteItem)
        {
            _context.DireccionAdministrador.Add(direccionClienteItem);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DireccionClienteItemExists(direccionClienteItem.Id_Cliente))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetDireccionClienteItem", new { id = direccionClienteItem.Id_Cliente }, direccionClienteItem);
        }

        // DELETE: api/DireccionCliente/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDireccionClienteItem(string id)
        {
            var direccionClienteItem = await _context.DireccionAdministrador.FindAsync(id);
            if (direccionClienteItem == null)
            {
                return NotFound();
            }

            _context.DireccionAdministrador.Remove(direccionClienteItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DireccionClienteItemExists(string id)
        {
            return _context.DireccionAdministrador.Any(e => e.Id_Cliente == id);
        }
    }
}

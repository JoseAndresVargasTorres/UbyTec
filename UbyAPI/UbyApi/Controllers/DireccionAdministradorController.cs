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
    public class DireccionAdministradorController : ControllerBase
    {
        private readonly DireccionAdministradorContext _context;

        public DireccionAdministradorController(DireccionAdministradorContext context)
        {
            _context = context;
        }

        // GET: api/DireccionAdministrador
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DireccionAdministradorItem>>> GetDireccionesAdministradores()
        {
            return await _context.DireccionesAdministradores.ToListAsync();
        }

        // GET: api/DireccionAdministrador/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DireccionAdministradorItem>> GetDireccionAdministradorItem(int id)
        {
            var direccionAdministradorItem = await _context.DireccionesAdministradores.FindAsync(id);

            if (direccionAdministradorItem == null)
            {
                return NotFound();
            }

            return direccionAdministradorItem;
        }

        // PUT: api/DireccionAdministrador/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDireccionAdministradorItem(int id, DireccionAdministradorItem direccionAdministradorItem)
        {
            if (id != direccionAdministradorItem.IdAdmin)
            {
                return BadRequest();
            }

            _context.Entry(direccionAdministradorItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DireccionAdministradorItemExists(id))
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

        // POST: api/DireccionAdministrador
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DireccionAdministradorItem>> PostDireccionAdministradorItem(DireccionAdministradorItem direccionAdministradorItem)
        {
            _context.DireccionesAdministradores.Add(direccionAdministradorItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDireccionAdministradorItem", new { id = direccionAdministradorItem.IdAdmin }, direccionAdministradorItem);
        }

        // DELETE: api/DireccionAdministrador/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDireccionAdministradorItem(int id)
        {
            var direccionAdministradorItem = await _context.DireccionesAdministradores.FindAsync(id);
            if (direccionAdministradorItem == null)
            {
                return NotFound();
            }

            _context.DireccionesAdministradores.Remove(direccionAdministradorItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DireccionAdministradorItemExists(int id)
        {
            return _context.DireccionesAdministradores.Any(e => e.IdAdmin == id);
        }
    }
}

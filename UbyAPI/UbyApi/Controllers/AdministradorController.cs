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
    public class AdministradorController : ControllerBase
    {
        private readonly AdministradorContext _context;

        public AdministradorController(AdministradorContext context)
        {
            _context = context;
        }

        // GET: api/Administrador
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdministradorItem>>> GetAdministrador()
        {
            return await _context.Administrador.ToListAsync();
        }

        // GET: api/Administrador/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AdministradorItem>> GetAdministradorItem(int id)
        {
            var administradorItem = await _context.Administrador.FindAsync(id);

            if (administradorItem == null)
            {
                return NotFound();
            }

            return administradorItem;
        }

        // PUT: api/Administrador/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdministradorItem(int id, AdministradorItem administradorItem)
        {
            if (id != administradorItem.Cedula)
            {
                return BadRequest();
            }

            _context.Entry(administradorItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdministradorItemExists(id))
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

        // POST: api/Administrador
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AdministradorItem>> PostAdministradorItem(AdministradorItem administradorItem)
        {
            _context.Administrador.Add(administradorItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAdministradorItem", new { id = administradorItem.Cedula }, administradorItem);
        }

        // DELETE: api/Administrador/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdministradorItem(int id)
        {
            var administradorItem = await _context.Administrador.FindAsync(id);
            if (administradorItem == null)
            {
                return NotFound();
            }

            _context.Administrador.Remove(administradorItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AdministradorItemExists(int id)
        {
            return _context.Administrador.Any(e => e.Cedula == id);
        }
    }
}

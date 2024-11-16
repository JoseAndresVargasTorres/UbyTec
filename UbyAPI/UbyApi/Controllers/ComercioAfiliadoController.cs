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
    public class ComercioAfiliadoController : ControllerBase
    {
        private readonly ComercioAfiliadoContext _context;

        public ComercioAfiliadoController(ComercioAfiliadoContext context)
        {
            _context = context;
        }

        // GET: api/ComercioAfiliado
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ComercioAfiliadoItem>>> GetComeriosAfiliados()
        {
            return await _context.ComeriosAfiliados.ToListAsync();
        }

        // GET: api/ComercioAfiliado/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ComercioAfiliadoItem>> GetComercioAfiliadoItem(string id)
        {
            var comercioAfiliadoItem = await _context.ComeriosAfiliados.FindAsync(id);

            if (comercioAfiliadoItem == null)
            {
                return NotFound();
            }

            return comercioAfiliadoItem;
        }

        // PUT: api/ComercioAfiliado/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComercioAfiliadoItem(string id, ComercioAfiliadoItem comercioAfiliadoItem)
        {
            if (id != comercioAfiliadoItem.CedulaJuridica)
            {
                return BadRequest();
            }

            _context.Entry(comercioAfiliadoItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ComercioAfiliadoItemExists(id))
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

        // POST: api/ComercioAfiliado
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ComercioAfiliadoItem>> PostComercioAfiliadoItem(ComercioAfiliadoItem comercioAfiliadoItem)
        {
            _context.ComeriosAfiliados.Add(comercioAfiliadoItem);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ComercioAfiliadoItemExists(comercioAfiliadoItem.CedulaJuridica))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetComercioAfiliadoItem", new { id = comercioAfiliadoItem.CedulaJuridica }, comercioAfiliadoItem);
        }

        // DELETE: api/ComercioAfiliado/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComercioAfiliadoItem(string id)
        {
            var comercioAfiliadoItem = await _context.ComeriosAfiliados.FindAsync(id);
            if (comercioAfiliadoItem == null)
            {
                return NotFound();
            }

            _context.ComeriosAfiliados.Remove(comercioAfiliadoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ComercioAfiliadoItemExists(string id)
        {
            return _context.ComeriosAfiliados.Any(e => e.CedulaJuridica == id);
        }
    }
}

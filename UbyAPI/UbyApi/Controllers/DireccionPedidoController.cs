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
    public class DireccionPedidoController : ControllerBase
    {
        private readonly DireccionPedidoContext _context;

        public DireccionPedidoController(DireccionPedidoContext context)
        {
            _context = context;
        }

        // GET: api/DireccionPedido
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DireccionPedidoItem>>> GetDireccionesPedido()
        {
            return await _context.DireccionesPedido.ToListAsync();
        }

        // GET: api/DireccionPedido/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DireccionPedidoItem>> GetDireccionPedidoItem(int id)
        {
            var direccionPedidoItem = await _context.DireccionesPedido.FindAsync(id);

            if (direccionPedidoItem == null)
            {
                return NotFound();
            }

            return direccionPedidoItem;
        }

        // PUT: api/DireccionPedido/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDireccionPedidoItem(int id, DireccionPedidoItem direccionPedidoItem)
        {
            if (id != direccionPedidoItem.NumPedido)
            {
                return BadRequest();
            }

            _context.Entry(direccionPedidoItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DireccionPedidoItemExists(id))
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

        // POST: api/DireccionPedido
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DireccionPedidoItem>> PostDireccionPedidoItem(DireccionPedidoItem direccionPedidoItem)
        {
            _context.DireccionesPedido.Add(direccionPedidoItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDireccionPedidoItem", new { id = direccionPedidoItem.NumPedido }, direccionPedidoItem);
        }

        // DELETE: api/DireccionPedido/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDireccionPedidoItem(int id)
        {
            var direccionPedidoItem = await _context.DireccionesPedido.FindAsync(id);
            if (direccionPedidoItem == null)
            {
                return NotFound();
            }

            _context.DireccionesPedido.Remove(direccionPedidoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DireccionPedidoItemExists(int id)
        {
            return _context.DireccionesPedido.Any(e => e.NumPedido == id);
        }
    }
}

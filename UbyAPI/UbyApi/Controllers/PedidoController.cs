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
    public class PedidoController : ControllerBase
    {
        private readonly PedidoContext _context;

        public PedidoController(PedidoContext context)
        {
            _context = context;
        }

        // GET: api/Pedido
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidoItem>>> GetPedidos()
        {
            return await _context.Pedidos.ToListAsync();
        }

        // GET: api/Pedido/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PedidoItem>> GetPedidoItem(int id)
        {
            var pedidoItem = await _context.Pedidos.FindAsync(id);

            if (pedidoItem == null)
            {
                return NotFound();
            }

            return pedidoItem;
        }

        // PUT: api/Pedido/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPedidoItem(int id, PedidoItem pedidoItem)
        {
            if (id != pedidoItem.NumPedido)
            {
                return BadRequest();
            }

            _context.Entry(pedidoItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PedidoItemExists(id))
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

        // POST: api/Pedido
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PedidoItem>> PostPedidoItem(PedidoItem pedidoItem)
        {
            _context.Pedidos.Add(pedidoItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPedidoItem", new { id = pedidoItem.NumPedido }, pedidoItem);
        }

        // DELETE: api/Pedido/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePedidoItem(int id)
        {
            var pedidoItem = await _context.Pedidos.FindAsync(id);
            if (pedidoItem == null)
            {
                return NotFound();
            }

            _context.Pedidos.Remove(pedidoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PedidoItemExists(int id)
        {
            return _context.Pedidos.Any(e => e.NumPedido == id);
        }
    }
}

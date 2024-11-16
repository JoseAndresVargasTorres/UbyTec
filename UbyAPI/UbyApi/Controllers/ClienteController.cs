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
    public class ClienteController : ControllerBase
    {
        private readonly ClienteContext _context;

        public ClienteController(ClienteContext context)
        {
            _context = context;
        }

        // GET: api/Cliente
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteItem>>> GetClientes()
        {
            return await _context.Clientes.ToListAsync();
        }

        // GET: api/Cliente/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteItem>> GetClienteItem(int id)
        {
            var clienteItem = await _context.Clientes.FindAsync(id);

            if (clienteItem == null)
            {
                return NotFound();
            }

            return clienteItem;
        }

        // PUT: api/Cliente/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClienteItem(int id, ClienteItem clienteItem)
        {
            if (id != clienteItem.Cedula)
            {
                return BadRequest();
            }

            _context.Entry(clienteItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteItemExists(id))
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

        // POST: api/Cliente
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ClienteItem>> PostClienteItem(ClienteItem clienteItem)
        {
            _context.Clientes.Add(clienteItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClienteItem", new { id = clienteItem.Cedula }, clienteItem);
        }

        // DELETE: api/Cliente/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClienteItem(int id)
        {
            var clienteItem = await _context.Clientes.FindAsync(id);
            if (clienteItem == null)
            {
                return NotFound();
            }

            _context.Clientes.Remove(clienteItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClienteItemExists(int id)
        {
            return _context.Clientes.Any(e => e.Cedula == id);
        }
    }
}

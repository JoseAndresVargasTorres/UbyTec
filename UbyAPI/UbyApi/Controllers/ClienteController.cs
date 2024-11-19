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
        public async Task<ActionResult<IEnumerable<ClienteItem>>> GetCliente()
        {
            return await _context.Cliente.ToListAsync();
        }

        // GET: api/Cliente/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteItem>> GetClienteItem(int id)
        {
            var clienteItem = await _context.Cliente.FindAsync(id);

            if (clienteItem == null)
            {
                return NotFound();
            }

            return clienteItem;
        }

        [HttpGet("{Password}/{Usuario}")]
        public async Task<IActionResult> GetClienteByPasswordAndUsuario(string Password, string Usuario)
        {
            // Ejecutar el procedimiento almacenado directamente sin intentar componerlo con LINQ
            var result = await _context.Cliente.FromSqlRaw("EXEC clave_cliente @Usuario = {0}, @Password = {1}", Usuario, Password).ToListAsync();

            // Si el procedimiento devuelve registros, verifica si los valores son nulos
            if (result.Any())
            {
                // Reemplazar valores nulos si es necesario
                var cliente = result.FirstOrDefault();
                if (
                    (cliente.Cedula == -1)    &&
                    (cliente.Usuario == "-1") &&
                    (cliente.Password == "-1") &&
                    (cliente.Nombre == "-1") &&
                    (cliente.Apellido1 == "-1") &&
                    (cliente.Apellido2 == "-1") &&
                    (cliente.Correo == "-1")
                )
                {
                    return Unauthorized("Cédula o contraseña incorrecta.");
                }
                
                return Ok(cliente);
            }
            else
            {
                return Unauthorized("Cédula o contraseña incorrecta.");
            }
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
            _context.Cliente.Add(clienteItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClienteItem", new { id = clienteItem.Cedula }, clienteItem);
        }

        // DELETE: api/Cliente/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClienteItem(int id)
        {
            var clienteItem = await _context.Cliente.FindAsync(id);
            if (clienteItem == null)
            {
                return NotFound();
            }

            _context.Cliente.Remove(clienteItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClienteItemExists(int id)
        {
            return _context.Cliente.Any(e => e.Cedula == id);
        }
    }
}

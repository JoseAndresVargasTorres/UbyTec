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
            try
            {
                var clientes = await _context.Cliente.ToListAsync();
                return Ok(clientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener clientes", error = ex.Message });
            }
        }


         // GET: api/Administrador/5
        [HttpGet("{cedula}")]
        public async Task<ActionResult<ClienteItem>> GetClienteItem(string cedula)
        {
            try
            {
                if (!int.TryParse(cedula, out int cedulaInt))
                {
                    return BadRequest(new { message = "La cédula debe ser un número válido" });
                }

                var cliente = await _context.Cliente.FindAsync(cedulaInt);

                if (cliente == null)
                {
                    return NotFound(new { message = $"No se encontró el clientes con cédula {cedula}" });
                }

                return Ok(cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener el clientes", error = ex.Message });
            }
        }


        // PUT: api/Cliente/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{cedula}")]
        public async Task<IActionResult> PutClienterItem(string cedula, [FromBody] ClienteItem cliente)
        {
            try
            {
                if (!int.TryParse(cedula, out int cedulaInt))
                {
                    return BadRequest(new { message = "La cédula debe ser un número válido" });
                }

                if (cedulaInt != cliente.Cedula)
                {
                    return BadRequest(new { message = "La cédula no coincide con el cliente a actualizar" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Datos del cliente inválidos", errors = ModelState });
                }

                _context.Entry(cliente).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Cliente actualizado exitosamente" });
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ClienteItemExists(cedulaInt))
                    {
                        return NotFound(new { message = $"No se encontró el cliente con cédula {cedula}" });
                    }
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al actualizar el cliente", error = ex.Message });
            }
        }


        // POST: api/Cliente
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
         // POST: api/Administrador
        [HttpPost]
        public async Task<ActionResult<ClienteItem>> PostClienteItem([FromBody] ClienteItem cliente)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Datos del cliente inválidos", errors = ModelState });
                }

                // Validar que la cédula no exista
                if (await _context.Cliente.AnyAsync(a => a.Cedula == cliente.Cedula))
                {
                    return BadRequest(new { message = $"Ya existe un administrador con la cédula {cliente.Cedula}" });
                }

                _context.Cliente.Add(cliente);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetClienteItem), 
                    new { cedula = cliente.Cedula }, cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al crear el administrador", error = ex.Message });
            }
        }
        // DELETE: api/Cliente/5
        [HttpDelete("{cedula}")]
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

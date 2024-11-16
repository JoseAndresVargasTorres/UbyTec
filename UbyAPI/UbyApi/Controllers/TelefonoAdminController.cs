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
    public class TelefonoAdminController : ControllerBase
    {
        private readonly TelefonoAdminContext _context;

        public TelefonoAdminController(TelefonoAdminContext context)
        {
            _context = context;
        }

        // GET: api/TelefonoAdmin
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TelefonoAdminItem>>> GetTelefonoAdmin()
        {
            return await _context.TelefonoAdmin.ToListAsync();
        }

        // GET: api/TelefonoAdmin/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TelefonoAdminItem>> GetTelefonoAdminItem(int id)
        {
            var telefonoAdminItem = await _context.TelefonoAdmin.FindAsync(id);

            if (telefonoAdminItem == null)
            {
                return NotFound();
            }

            return telefonoAdminItem;
        }

        // PUT: api/TelefonoAdmin/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTelefonoAdminItem(int id, TelefonoAdminItem telefonoAdminItem)
        {
            if (id != telefonoAdminItem.CedulaAdmin)
            {
                return BadRequest();
            }

            _context.Entry(telefonoAdminItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TelefonoAdminItemExists(id))
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

        // POST: api/TelefonoAdmin
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TelefonoAdminItem>> PostTelefonoAdminItem(TelefonoAdminItem telefonoAdminItem)
        {
            _context.TelefonoAdmin.Add(telefonoAdminItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTelefonoAdminItem", new { id = telefonoAdminItem.CedulaAdmin }, telefonoAdminItem);
        }

        // DELETE: api/TelefonoAdmin/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTelefonoAdminItem(int id)
        {
            var telefonoAdminItem = await _context.TelefonoAdmin.FindAsync(id);
            if (telefonoAdminItem == null)
            {
                return NotFound();
            }

            _context.TelefonoAdmin.Remove(telefonoAdminItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TelefonoAdminItemExists(int id)
        {
            return _context.TelefonoAdmin.Any(e => e.CedulaAdmin == id);
        }
    }
}

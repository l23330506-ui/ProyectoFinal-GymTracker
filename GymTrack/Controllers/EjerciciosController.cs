using GymTrack.Data;
using GymTrack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EjerciciosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EjerciciosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ejercicio>>> GetEjercicios()
        {
            return await _context.Ejercicios.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Ejercicio>> GetEjercicio(int id)
        {
            var ejercicio = await _context.Ejercicios.FindAsync(id);
            if (ejercicio == null)
                return NotFound();
            return ejercicio;
        }

        [HttpPost]
        public async Task<ActionResult<Ejercicio>> PostEjercicio(Ejercicio ejercicio)
        {
            _context.Ejercicios.Add(ejercicio);
            await _context.SaveChangesAsync();
            return CreatedAtAction(
                nameof(GetEjercicio),
                new { id = ejercicio.EjercicioId },
                ejercicio
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEjercicio(int id, Ejercicio ejercicio)
        {
            if (id != ejercicio.EjercicioId)
                return BadRequest();
            _context.Entry(ejercicio).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEjercicio(int id)
        {
            var ejercicio = await _context.Ejercicios.FindAsync(id);
            if (ejercicio == null)
                return NotFound();
            _context.Ejercicios.Remove(ejercicio);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

using GymTrack.Data;
using GymTrack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RutinasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RutinasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rutina>>> GetRutinas()
        {
            return await _context
                .Rutinas.Include(r => r.RutinaEjercicios)
                    .ThenInclude(re => re.Ejercicio)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Rutina>> GetRutina(int id)
        {
            var rutina = await _context
                .Rutinas.Include(r => r.RutinaEjercicios)
                    .ThenInclude(re => re.Ejercicio)
                .FirstOrDefaultAsync(r => r.RutinaId == id);

            if (rutina == null)
                return NotFound();
            return rutina;
        }

        [HttpPost]
        public async Task<ActionResult<Rutina>> PostRutina(Rutina rutina)
        {
            rutina.FechaCreacion = DateTime.Now;
            _context.Rutinas.Add(rutina);
            await _context.SaveChangesAsync();

            var rutinaCompleta = await _context.Rutinas
                .Include(r => r.RutinaEjercicios)
                .ThenInclude(re => re.Ejercicio)
                .FirstOrDefaultAsync(r => r.RutinaId == rutina.RutinaId);

            return CreatedAtAction(nameof(GetRutina), new { id = rutina.RutinaId }, rutinaCompleta);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRutina(int id, Rutina rutina)
        {
            if (id != rutina.RutinaId)
                return BadRequest();
            _context.Entry(rutina).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRutina(int id)
        {
            var rutina = await _context.Rutinas.FindAsync(id);
            if (rutina == null)
                return NotFound();
            _context.Rutinas.Remove(rutina);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/ejercicios")]
        public async Task<IActionResult> AgregarEjercicio(int id, RutinaEjercicio rutinaEjercicio)
        {
            rutinaEjercicio.RutinaId = id;
            _context.RutinaEjercicios.Add(rutinaEjercicio);
            await _context.SaveChangesAsync();

            var detalle = await _context.RutinaEjercicios
                .Include(re => re.Ejercicio)
                .FirstOrDefaultAsync(re => re.RutinaEjercicioId == rutinaEjercicio.RutinaEjercicioId);

            return Ok(detalle);
        }

        [HttpDelete("{id}/ejercicios/{ejercicioId}")]
        public async Task<IActionResult> QuitarEjercicio(int id, int ejercicioId)
        {
            var rutinaEjercicio = await _context.RutinaEjercicios.FirstOrDefaultAsync(re =>
                re.RutinaId == id && re.EjercicioId == ejercicioId
            );

            if (rutinaEjercicio == null)
                return NotFound();
            _context.RutinaEjercicios.Remove(rutinaEjercicio);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

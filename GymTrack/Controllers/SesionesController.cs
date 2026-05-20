using GymTrack.Data;
using GymTrack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SesionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SesionesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Sesion>> IniciarSesion(Sesion sesion)
        {
            sesion.FechaInicio = DateTime.Now;
            _context.Sesiones.Add(sesion);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSesion), new { id = sesion.SesionId }, sesion);
        }

        [HttpPut("{id}/finalizar")]
        public async Task<IActionResult> FinalizarSesion(int id)
        {
            var sesion = await _context.Sesiones.FindAsync(id);
            if (sesion == null)
                return NotFound();
            sesion.FechaFin = DateTime.Now;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/detalle")]
        public async Task<IActionResult> AgregarDetalle(int id, SesionDetalle detalle)
        {
            detalle.SesionId = id;
            _context.SesionDetalles.Add(detalle);
            await _context.SaveChangesAsync();
            return Ok(detalle);
        }

        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<Sesion>>> GetHistorial(int usuarioId)
        {
            return await _context
                .Sesiones.Include(s => s.Rutina)
                .Include(s => s.Detalles)
                .Where(s => s.UsuarioId == usuarioId)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sesion>> GetSesion(int id)
        {
            var sesion = await _context
                .Sesiones.Include(s => s.Rutina)
                .Include(s => s.Detalles)
                    .ThenInclude(d => d.Ejercicio)
                .FirstOrDefaultAsync(s => s.SesionId == id);

            if (sesion == null)
                return NotFound();
            return sesion;
        }
    }
}

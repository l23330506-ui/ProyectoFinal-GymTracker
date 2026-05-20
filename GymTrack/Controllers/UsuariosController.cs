using GymTrack.Data;
using GymTrack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("registro")]
        public async Task<IActionResult> Registro(Usuario usuario)
        {
            if (string.IsNullOrWhiteSpace(usuario.Email) || !usuario.Email.Contains("@"))
                return BadRequest("El email no es válido.");

            var emailExiste = await _context.Usuarios.AnyAsync(u =>
                u.Email.ToLower() == usuario.Email.ToLower()
            );

            if (emailExiste)
                return BadRequest("El email ya está registrado.");

            usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(usuario.PasswordHash);
            usuario.FechaRegistro = DateTime.Now;

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario registrado correctamente", id = usuario.UsuarioId });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(Usuario loginData)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u =>
                u.Email == loginData.Email
            );

            if (usuario == null)
                return Unauthorized("Email o contraseña incorrectos.");

            bool passwordValido = BCrypt.Net.BCrypt.Verify(
                loginData.PasswordHash,
                usuario.PasswordHash
            );

            if (!passwordValido)
                return Unauthorized("Email o contraseña incorrectos.");

            return Ok(
                new
                {
                    id = usuario.UsuarioId,
                    nombre = usuario.Nombre,
                    email = usuario.Email,
                }
            );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return NotFound();
            return usuario;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.UsuarioId)
                return BadRequest();
            _context.Entry(usuario).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return NotFound();
            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

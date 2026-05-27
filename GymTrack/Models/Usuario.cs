namespace GymTrack.Models
{
    public class Usuario
    {
        public int UsuarioId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime FechaRegistro { get; set; } = DateTime.Now;

        public ICollection<Rutina> Rutinas { get; set; } = new List<Rutina>();
        public ICollection<Sesion> Sesiones { get; set; } = new List<Sesion>();
    }
}

namespace GymTrack.Models
{
    public class Sesion
    {
        public int SesionId { get; set; }
        public int UsuarioId { get; set; }
        public int RutinaId { get; set; }
        public DateTime FechaInicio { get; set; } = DateTime.Now;
        public DateTime? FechaFin { get; set; }

        public Rutina? Rutina { get; set; }
        public ICollection<SesionDetalle> Detalles { get; set; } = new List<SesionDetalle>();
    }
}

namespace GymTrack.Models
{
    public class SesionDetalle
    {
        public int DetalleId { get; set; }
        public int SesionId { get; set; }
        public int EjercicioId { get; set; }
        public int SeriesHechas { get; set; }
        public int RepsHechas { get; set; }
        public decimal PesoKg { get; set; }

        public Sesion Sesion { get; set; } = null!;
        public Ejercicio Ejercicio { get; set; } = null!;
    }
}

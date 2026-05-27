namespace GymTrack.Models
{
    public class RutinaEjercicio
    {
        public int RutinaEjercicioId { get; set; }
        public int RutinaId { get; set; }
        public int EjercicioId { get; set; }
        public int Series { get; set; }
        public int Repeticiones { get; set; }
        public int Orden { get; set; }

        public Rutina? Rutina { get; set; }
        public Ejercicio? Ejercicio { get; set; }
    }
}

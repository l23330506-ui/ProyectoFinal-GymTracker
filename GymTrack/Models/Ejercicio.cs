namespace GymTrack.Models
{
    public class Ejercicio
    {
        public int EjercicioId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string GrupoMuscular { get; set; } = string.Empty;
        public string Dificultad { get; set; } = string.Empty;

        public ICollection<RutinaEjercicio> RutinaEjercicios { get; set; } = new List<RutinaEjercicio>();
    }
}

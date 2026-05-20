using GymTrack.Models;
using Microsoft.EntityFrameworkCore;

namespace GymTrack.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Ejercicio> Ejercicios { get; set; }
        public DbSet<Rutina> Rutinas { get; set; }
        public DbSet<RutinaEjercicio> RutinaEjercicios { get; set; }
        public DbSet<Sesion> Sesiones { get; set; }
        public DbSet<SesionDetalle> SesionDetalles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<RutinaEjercicio>()
                .HasOne(re => re.Rutina)
                .WithMany(r => r.RutinaEjercicios)
                .HasForeignKey(re => re.RutinaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder
                .Entity<RutinaEjercicio>()
                .HasOne(re => re.Ejercicio)
                .WithMany(e => e.RutinaEjercicios)
                .HasForeignKey(re => re.EjercicioId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<SesionDetalle>()
                .HasOne(sd => sd.Sesion)
                .WithMany(s => s.Detalles)
                .HasForeignKey(sd => sd.SesionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder
                .Entity<SesionDetalle>()
                .HasOne(sd => sd.Ejercicio)
                .WithMany()
                .HasForeignKey(sd => sd.EjercicioId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Ejercicio>()
                .HasData(
                    new Ejercicio
                    {
                        EjercicioId = 1,
                        Nombre = "Press de Banca",
                        Descripcion = "Ejercicio compuesto para pecho",
                        GrupoMuscular = "Pecho",
                        Dificultad = "Intermedio",
                    },
                    new Ejercicio
                    {
                        EjercicioId = 2,
                        Nombre = "Sentadilla Libre",
                        Descripcion = "El rey de los ejercicios de pierna",
                        GrupoMuscular = "Pierna",
                        Dificultad = "Intermedio",
                    },
                    new Ejercicio
                    {
                        EjercicioId = 3,
                        Nombre = "Dominadas",
                        Descripcion = "Ejercicio de peso corporal para espalda",
                        GrupoMuscular = "Espalda",
                        Dificultad = "Avanzado",
                    },
                    new Ejercicio
                    {
                        EjercicioId = 4,
                        Nombre = "Curl de Bíceps",
                        Descripcion = "Aislamiento para bíceps",
                        GrupoMuscular = "Brazos",
                        Dificultad = "Básico",
                    },
                    new Ejercicio
                    {
                        EjercicioId = 5,
                        Nombre = "Press Militar",
                        Descripcion = "Empuje vertical para hombros",
                        GrupoMuscular = "Hombros",
                        Dificultad = "Intermedio",
                    },
                    new Ejercicio
                    {
                        EjercicioId = 6,
                        Nombre = "Peso Muerto",
                        Descripcion = "Ejercicio compuesto para espalda baja y pierna",
                        GrupoMuscular = "Espalda",
                        Dificultad = "Avanzado",
                    },
                    new Ejercicio
                    {
                        EjercicioId = 7,
                        Nombre = "Fondos en Paralelas",
                        Descripcion = "Ejercicio para tríceps y pecho",
                        GrupoMuscular = "Pecho",
                        Dificultad = "Intermedio",
                    },
                    new Ejercicio
                    {
                        EjercicioId = 8,
                        Nombre = "Plancha",
                        Descripcion = "Ejercicio isométrico para core",
                        GrupoMuscular = "Core",
                        Dificultad = "Básico",
                    }
                );
        }
    }
}

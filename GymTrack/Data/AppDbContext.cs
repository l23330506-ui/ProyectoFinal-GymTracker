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
        }
    }
}

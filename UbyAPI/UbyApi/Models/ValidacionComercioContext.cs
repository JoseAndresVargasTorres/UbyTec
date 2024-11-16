using Microsoft.EntityFrameworkCore;
namespace UbyApi.Models;

public class ValidacionComercioContext : DbContext
{
    public DbSet<ValidacionComercioItem> ValidacionesComercio { get; set; } = null!;

    public ValidacionComercioContext(DbContextOptions<ValidacionComercioContext> options)
        : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar las relaciones
        modelBuilder.Entity<ValidacionComercioItem>()
            .HasKey(vc => vc.CedulaAdmin); // Define la clave primaria como 'CedulaAdmin'

    }
}
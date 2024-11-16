using Microsoft.EntityFrameworkCore;
namespace UbyApi.Models;

public class TelefonoAdminContext : DbContext
{
    public DbSet<TelefonoAdminItem> TelefonosAdmin { get; set; } = null!;

    public TelefonoAdminContext(DbContextOptions<TelefonoAdminContext> options)
        : base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de la tabla TelefonoAdmin
        modelBuilder.Entity<TelefonoAdminItem>()
            .HasKey(ta => ta.CedulaAdmin); // Define la clave primaria

    }
}
